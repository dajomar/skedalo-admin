import { useAuthStore } from "@/store/authStore";
import { useResourcesStore } from "@/store/resourcesStore";
import { useSchedulesStore } from "@/store/schedulesStore";
import { useSedeStore } from "@/store/useSedeStore";
import type { Branches, Resources, Schedules, ServiceCategories } from "@/types";
import { showAlertError, showAlertInfo, confirmCanceling } from "@/utils/sweetalert2";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/UI/Pagination";
import { FooterPagination } from "@/components/UI/FooterPagination";



export const ScheduleResource = () => {

    const { t } = useTranslation();
    const { schedules, setSelectedResourceId, listByResource, saveList } = useSchedulesStore();
    const { resources, listResourcesByCompany } = useResourcesStore();
    const { sedes, listarSedes } = useSedeStore();
    const { companyId } = useAuthStore();

    const [showModal, setShowModal] = useState(false);
    const [selectedResource, setSelectedResource] = useState<Resources | null>(null);
    const [selectedSede, setSelectedSede] = useState<Branches | null>(null);
    const [editableSchedules, setEditableSchedules] = useState<Schedules[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    
    // search filter
    const [searchTerm, setSearchTerm] = useState("");

    const daysOfWeek = t("daysOfWeek", { returnObjects: true }) as string[];

    // Acepta "HH:mm" o "HH:mm:ss"
    const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

    const isValidTime = (t?: string | null): boolean =>
        typeof t === "string" && TIME_RE.test(t.trim());

    const toSeconds = (t: string): number => {
        const [h, m, s] = t.trim().split(":");
        const hh = parseInt(h, 10);
        const mm = parseInt(m, 10);
        const ss = s ? parseInt(s, 10) : 0;
        return hh * 3600 + mm * 60 + ss;
    };
    //------------------------------------------------

    useMemo(() => {
        if (resources.length === 0) listResourcesByCompany(companyId);
        if (sedes.length === 0) listarSedes(companyId);
        // eslint-disable-next-line
    }, [companyId]);

    // Filtrar resources por nombre y descripción
    const filteredResources = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return resources;
        return resources.filter(r =>
            r.resourceName?.toLowerCase().includes(term) ||
            r.description?.toLowerCase().includes(term)
        );
    }, [resources, searchTerm]);

    


    useEffect(() => {
        if (selectedResource) {
            listByResource(selectedResource.resourceId ?? 0);
            setSelectedResourceId(selectedResource?.resourceId ?? 0);
        }

    }, [selectedResource, listByResource, setSelectedResourceId]);

    useEffect(() => {
        setEditableSchedules(schedules.map(s => ({ ...s })));
    }, [schedules]);

    // Get sede info for selected resource
    useEffect(() => {
        if (selectedResource) {
            const sede = sedes.find(s => s.branchId === selectedResource.branchId);
            setSelectedSede(sede || null);
        } else {
            setSelectedSede(null);
        }
    }, [selectedResource, sedes]);

    const handleSelectResource = (resource: Resources) => {
        setSelectedResource(resource);
        setShowModal(false);
        setIsEditing(false);
    };

    const handleAddRow = () => {
        if (!selectedResource) return;
        setEditableSchedules([
            ...editableSchedules,
            {
                scheduleId: null,
                branchId: selectedResource.branchId,
                resourceId: selectedResource.resourceId ?? 0,
                dayOfWeek: 1,
                startTime: "08:00:00",
                endTime: "17:00:00",
                status: "A"
            }
        ]);
        setIsEditing(true);
    };

    const handleChange = <K extends keyof Schedules>(idx: number, field: K, value: Schedules[K]) => {
        setEditableSchedules(schedules =>
            schedules.map((row, i) =>
                i === idx ? { ...row, [field]: value } : row
            )
        );
        setIsEditing(true);
    };

    const handleDeleteRow = async (idx: number) => {
        const confirmed = await confirmCanceling();
        if (!confirmed) return;
        setEditableSchedules(schedules => schedules.filter((_, i) => i !== idx));
        setIsEditing(true);
    };

    const handleSave = async () => {

        // 1) Requerido + formato correcto
        const invalidFormatIdx = editableSchedules.findIndex(
            r => !isValidTime(r.startTime) || !isValidTime(r.endTime)
        );
        if (invalidFormatIdx !== -1) {
            showAlertError(
                t("validation.invalid-time-format") ||
                "Formato de hora inválido. Usa HH:mm  (ej: 08:00 a.m. o 08:00 p.m.)."
            );
            return;
        }

        // 2) Rango: inicio < fin
        const invalidRangeIdx = editableSchedules.findIndex(
            r => toSeconds(r.startTime!) >= toSeconds(r.endTime!)
        );
        if (invalidRangeIdx !== -1) {
            showAlertError(
                t("validation.start-before-end") ||
                "La hora de inicio debe ser menor que la hora de fin en todas las filas."
            );
            return;
        }

        const resp = await saveList(editableSchedules);

        if (resp && resp.messageId === "TR000") {
            showAlertInfo(resp.messageText);
            // setFormData(initialResource);
            // setServicesTemp([]);
            // cleanResourcesServices();      
        } else if (resp) {
            showAlertError(resp.messageText);
        } else {
            showAlertError("Error al guardar los horarios");
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditableSchedules(schedules.map(s => ({ ...s })));
        setIsEditing(false);
    };

      // Información necesaria por paginación 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    const currentItems = filteredResources.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t('schedule-resource', 'Schedule Resource')}</h2>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="relative w-full sm:w-1/2 md:w-1/3">
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                            placeholder={t('search-resource', 'Buscar recurso por nombre o descripción')}
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200">
                            <span className="material-symbols-outlined text-base mr-2">filter_list</span>
                            Filters
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((res, idx) => (
                                <tr key={res.resourceId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap w-12">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-900 flex items-center">

                                        {res.photoUrl ? (
                                            <img src={res.photoUrl || '../../assets/placeholder.png'} alt="photo" className="w-10 h-10 rounded-full mr-3 object-cover" />
                                        ) : (
                                            <span className="flex-shrink-0 text-4xl rounded-full bg-cover bg-center material-symbols-outlined dark:text-text-dark"> person </span>
                                        )}
                                        <div>
                                            <div>{res.resourceName}</div>
                                            <div className="text-xs text-gray-500">{res.description}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sedes.find(s => s.branchId === res.branchId)?.branchName || ''}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.status || ''}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* <button
                                            onClick={() => { handleSelectResource(res); setShowModal(true); }}
                                            className="inline-flex items-center px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 mr-2">
                                            <span className="material-symbols-outlined mr-2">schedule</span>
                                            {t('modify-schedule', 'Modificar horario')}
                                        </button> */}
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={() => { handleSelectResource(res); setShowModal(true); }} className="text-primary hover:text-primary/70" title={t('common.edit')}>
                                                <span className="text-4xl material-symbols-outlined text-base">schedule</span>
                                            </button>
                                            
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                  <FooterPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={resources.length}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={setItemsPerPage}
                                />

            </div>

            {/* Modal: Edit schedules for selected resource */}
            {showModal && selectedResource && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => { setShowModal(false); setIsEditing(false); }} />
                    <div className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg z-10 p-6 overflow-hidden">

                        {/* header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4 p-3  rounded-xl shadow-sm">
                                {/* <img
                                    src={selectedResource.photoUrl || '/placeholder.png'}
                                    alt="photo"
                                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                                /> */}

                                {selectedResource.photoUrl ? (
                                    <img src={selectedResource.photoUrl || '../../assets/placeholder.png'} alt="photo" className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                                ) : (
                                    <span className="flex-shrink-0 text-4xl rounded-full bg-cover bg-center material-symbols-outlined dark:text-text-dark"> person </span>
                                )}


                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                        {selectedResource.resourceName}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {selectedResource.description}
                                    </span>
                                </div>


                            </div>

                            <div className="p-4  flex items-center justify-between">


                                <div className="flex items-center gap-2">
                                    <button onClick={handleAddRow} className="px-3 py-1 bg-gray-100 rounded">{t('add-row', 'Add Row')}</button>
                                    <button onClick={handleSave} className={`px-4 py-2 rounded text-white ${isEditing ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`} disabled={!isEditing}>{t('save', 'Save')}</button>
                                </div>
                            </div>

                            {/* <button
                                onClick={() => { handleCancel(); setShowModal(false); }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button> */}
                        </div>





                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs text-gray-500">{t('day', 'Day')}</th>
                                            <th className="px-4 py-2 text-left text-xs text-gray-500">{t('start', 'Start')}</th>
                                            <th className="px-4 py-2 text-left text-xs text-gray-500">{t('end', 'End')}</th>
                                            <th className="px-4 py-2 text-left text-xs text-gray-500">{t('status', 'Status')}</th>
                                            <th className="px-4 py-2 text-left text-xs text-gray-500">{t('actions', 'Actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {editableSchedules.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                    <select value={row.dayOfWeek} onChange={(e) => handleChange(i, 'dayOfWeek', Number(e.target.value))} className="rounded border-gray-300 px-2 py-1">
                                                        {daysOfWeek.map((d, di) => (
                                                            <option key={di} value={di + 1}>{d}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input type="time" value={row.startTime?.slice(0, 5) || ''} onChange={(e) => handleChange(i, 'startTime', e.target.value)} className="rounded border-gray-300 px-2 py-1" />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input type="time" value={row.endTime?.slice(0, 5) || ''} onChange={(e) => handleChange(i, 'endTime', e.target.value)} className="rounded border-gray-300 px-2 py-1" />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <select value={row.status} onChange={(e) => handleChange(i, 'status', e.target.value)} className="rounded border-gray-300 px-2 py-1">
                                                        <option value="A">Active</option>
                                                        <option value="I">Inactive</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button onClick={() => handleDeleteRow(i)} className="px-3 py-1 bg-red-100 text-red-600 rounded">
                                                        
                                                        <span className="material-symbols-outlined "> delete </span>
                                                        </button>
                                                    
                                                </td>
                                            </tr>
                                        ))}
                                        {editableSchedules.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">{t('no-schedules', 'No schedules defined')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end gap-2">
                            <button onClick={() => { handleCancel(); setShowModal(false); }} className="px-4 py-2 bg-gray-200 rounded">{t('cancel', 'Cancel')}</button>
                            <button onClick={handleSave} className={`px-4 py-2 rounded text-white ${isEditing ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 text-gray-600'}`} disabled={!isEditing}>{t('save', 'Save')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleResource;