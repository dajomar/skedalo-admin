import { FooterPagination } from "@/components/UI/FooterPagination";
import { useAuthStore } from "@/store/authStore";
import { useResourcesStore } from "@/store/resourcesStore";
import { useServicesStore } from "@/store/servicesStore";
import { useSedeStore } from "@/store/useSedeStore";
import type { Resources, ResourcesServices, ResourcesServicesDTO, Services } from "@/types";
import { showAlertError, showAlertInfo, showAlertWarning } from "@/utils/sweetalert2";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddNewResource } from "./components/AddNewResource";
import { AddServiceToResource } from "./components/AddServiceToResource";
import { ScheduleResource } from "../SchedulesPages/ScheduleResource";


export const ResourcesPage = () => {

    const { t } = useTranslation();
    const { companyId, userId } = useAuthStore();
    const { resources, resourcesServices, listResourcesByCompany,
        saveResourceServices, listByBranchAndResource,
        cleanResourcesServices, uploadResourcePhoto } = useResourcesStore();
    const { sedes, listarSedes } = useSedeStore();
    const { services, listServicesByCompany } = useServicesStore();

    const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
    const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string>("");

    const initialResource: Resources = {
        resourceId: null,
        //branchId: sedes.length > 0 ? sedes[0].branchId || 0 : 0,
        branchId: 0,
        resourceName: "",
        description: "",
        resourceType: "P",
        maxCapacity: 0,
        email: "",
        phoneNumber: "",
        status: "A",
        photoUrl: "",
        updatedAt: new Date(),
        updatedBy: 0,
    };

    const [formData, setFormData] = useState<Resources>(initialResource);
    const [validated, setValidated] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    // Lista temporal de servicios para el recurso
    const [servicesTemp, setServicesTemp] = useState<Services[]>([]);
    // Modal para asignar servicios a un recurso
    const [showServicesModal, setShowServicesModal] = useState(false);
    const [resourceForServices, setResourceForServices] = useState<Resources | null>(null);

    const [showScheduleModal, setShowSheduleModal] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);  
    const [selectScheduleResource, setSelectScheduleResource] = useState<Resources | null>(null); 
    

    useMemo(() => {
        if (resources.length === 0) listResourcesByCompany(companyId);
        if (sedes.length === 0) listarSedes(companyId);
        if (services.length === 0) listServicesByCompany(companyId);
        if (resourcesServices.length > 0) cleanResourcesServices();
        // eslint-disable-next-line
    }, [companyId]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };


    const itemRef = useRef<HTMLLIElement | null>(null); //especificamos el tipo
    const [maxHeight, setMaxHeight] = useState("200px"); // valor inicial

    useEffect(() => {
        if (itemRef.current) {
            const itemHeight = itemRef.current.offsetHeight;
            const margin = 4; // mismo valor que marginBottom
            const totalHeight = (itemHeight * 5) + (margin * 6);
            setMaxHeight(`${totalHeight}px`);
        }
    }, [servicesTemp]);

    // Este efecto se encarga de sincronizar servicesTemp cada vez que
    // cambien los servicios globales o los asociados a un recurso
    useEffect(() => {
        if (services.length === 0) return;

        const actualizados = services.filter(srv => srv.status === "A").map((srv) => {
            const asociado = resourcesServices.find(
                (rs) => rs.service.serviceId === srv.serviceId && rs.status === "A"
            );
            return {
                ...srv,
                status: asociado ? "A" : "I",
            };
        });

        setServicesTemp(actualizados);
    }, [services, resourcesServices]);

    const handleSelectResource = async (res: Resources) => {
        setFormData(res);
        setSelectedPhotoFile(null);
        setPreviewPhotoUrl(res.photoUrl || "");
        await listByBranchAndResource(res.branchId, res.resourceId || 0);
        setShowModal(true);
    };

    const handleSelectScheduleResource = (resource: Resources) => {
        setSelectScheduleResource(resource);
        setShowModal(false);
        setIsEditing(false);
    };

    // Abrir modal independiente para gestionar servicios del recurso
    const handleOpenServicesModal = async (res: Resources) => {
        setResourceForServices(res);
        // Cargar servicios asignados para este recurso (actualiza resourcesServices en store)
        await listByBranchAndResource(res.branchId, res.resourceId || 0);
        // servicesTemp será sincronizado por el useEffect que observa resourcesServices
        setShowServicesModal(true);
    };

    const handleCloseServicesModal = () => {
        setShowServicesModal(false);
        setResourceForServices(null);
    };

    const handleSaveServices = async () => {
        if (!resourceForServices) return;

        // Reconstruir DTO usando la misma lógica que en el submit principal
        const serviciosDTO: ResourcesServices[] = [];
        const resourceActual = { ...resourceForServices, updatedBy: userId, updatedAt: new Date() } as Resources;

        // Servicios que venían asociados (resourcesServices)
        resourcesServices.forEach((rs) => {
            const tempSrv = servicesTemp.find((s) => s.serviceId === rs.service.serviceId);
            if (tempSrv) {
                serviciosDTO.push({
                    ...rs,
                    status: tempSrv.status === "A" ? "A" : "I",
                    resource: resourceActual,
                    service: tempSrv,
                });
            }
        });

        // Servicios nuevos asociados
        servicesTemp.forEach((srv) => {
            const yaAsociado = resourcesServices.find((rs) => rs.service.serviceId === srv.serviceId);
            if (!yaAsociado && srv.status === "A") {
                serviciosDTO.push({
                    resServId: null,
                    branchId: resourceActual.branchId,
                    status: "A",
                    resource: resourceActual,
                    service: srv,
                });
            }
        });

        const resourceDTO: ResourcesServicesDTO = {
            resource: resourceActual,
            services: serviciosDTO,
        };

        const resp = await saveResourceServices(resourceDTO);
        if (resp && resp.messageId === "TR000") {
            showAlertInfo(resp.messageText || t('resources.servicesUpdated'));
            // refrescar
            await listByBranchAndResource(resourceActual.branchId, resp.dataNumber1 || resourceActual.resourceId || 0);
            await listResourcesByCompany(companyId);
            handleCloseServicesModal();
        } else if (resp) {
            showAlertError(resp.messageText || t('common.errorOccurred'));
        } else {
            showAlertError(t('common.errorOccurred'));
        }
    };


    const toggleActive = (id: number) => {
        setServicesTemp((prev) =>
            prev.map((srv) =>
                srv.serviceId === id
                    ? { ...srv, status: srv.status === "A" ? "I" : "A" }
                    : srv
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            // Construir ResourcesServicesDTO considerando servicios asociados, nuevos y desasociados
            const serviciosDTO: ResourcesServices[] = [];
            const resourceActual = { ...formData, updatedBy: userId, updatedAt: new Date() };

            // Servicios que venían asociados (resourcesServices)
            resourcesServices.forEach((rs) => {
                const tempSrv = servicesTemp.find((s) => s.serviceId === rs.service.serviceId);
                if (tempSrv) {
                    if (tempSrv.status === "A") {
                        // Sigue activo
                        serviciosDTO.push({
                            ...rs,
                            status: "A",
                            resource: resourceActual,
                            service: tempSrv,
                        });
                    } else {
                        // Se desasoció
                        serviciosDTO.push({
                            ...rs,
                            status: "I",
                            resource: resourceActual,
                            service: tempSrv,
                        });
                    }
                }
            });

            // Servicios nuevos asociados (no estaban en resourcesServices y ahora están activos)
            servicesTemp.forEach((srv) => {
                const yaAsociado = resourcesServices.find((rs) => rs.service.serviceId === srv.serviceId);
                if (!yaAsociado && srv.status === "A") {
                    serviciosDTO.push({
                        resServId: null,
                        branchId: formData.branchId,
                        status: "A",
                        resource: resourceActual,
                        service: srv,
                    });
                }
            });

            const resourceDTO: ResourcesServicesDTO = {
                resource: resourceActual,
                services: serviciosDTO,
            };

            const resp = await saveResourceServices(resourceDTO);

            if (resp && resp.messageId === "TR000") {

                setFormData({ ...resourceActual, resourceId: resp.dataNumber1 });
                //showAlertInfo(resp.messageText);
                await listByBranchAndResource(resourceActual.branchId, resp.dataNumber1 || 0);
                await listResourcesByCompany(companyId);
                /*setFormData(initialResource);
                 setServicesTemp([]);
                 cleanResourcesServices();  */

                setShowModal(false)

                if (selectedPhotoFile && (resp.dataNumber1 || resourceActual.resourceId)) {

                    const resourceId = resp.dataNumber1 || resourceActual.resourceId;
                    const photoResp = await uploadResourcePhoto(selectedPhotoFile, resourceId!);

                    if (photoResp && photoResp.messageId === "TR000") {
                        showAlertInfo(resp.messageText);
                    } else if (photoResp) {
                        showAlertWarning(t("photo-upload-error") + " " + photoResp.messageText);
                    } else {
                        showAlertWarning(t("photo-upload-error"));
                    }
                }
                else
                    showAlertInfo(resp.messageText);


            } else if (resp) {
                showAlertError(resp.messageText);
            } else {
                showAlertError(t("error-save-resource"));
            }
        }
        setValidated(true);
    };

    const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormData(initialResource);
        setServicesTemp([]);
        cleanResourcesServices();
        setValidated(false);
        setSelectedPhotoFile(null);
        setPreviewPhotoUrl("");
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedPhotoFile(file);
            const url = URL.createObjectURL(file);
            setPreviewPhotoUrl(url);
        } else {
            setSelectedPhotoFile(null);
            setPreviewPhotoUrl(formData.photoUrl || "");
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleAddNew = () => {
        setFormData(initialResource);
        setSelectedPhotoFile(null);
        setPreviewPhotoUrl("");
        setServicesTemp([]);
        cleanResourcesServices();
        setShowModal(true);
    };

    // Filter & pagination
    const filteredResources = useMemo(() => {
        return resources.filter(r =>
            (r.resourceName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.description || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [resources, searchTerm]);

    // Información necesaria por paginación 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    const currentItems = filteredResources.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );




    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="relative w-full sm:w-1/2 md:w-1/3">
                        <input
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            placeholder="Search resources..."
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200">
                            <span className="material-symbols-outlined text-base mr-2">filter_list</span>
                            Filters
                        </button> */}
                        <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                            <span className="material-symbols-outlined text-base mr-2">add</span>
                            {t('new-resource', 'New Resource')}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((r) => (
                                <tr key={r.resourceId ?? Math.random()} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.resourceId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-900 flex items-center">
                                        {r.photoUrl ? (
                                            <img src={r.photoUrl || '../../assets/placeholder.png'} alt="photo" className="w-10 h-10 rounded-full mr-3 object-cover" />
                                        ) : (
                                            <span className="flex-shrink-0 text-4xl rounded-full bg-cover bg-center material-symbols-outlined dark:text-text-dark"> person </span>
                                        )}
                                        <div>
                                            <div>{r.resourceName}</div>
                                            <div className="text-xs text-gray-500">{r.description}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sedes.find(s => s.branchId === r.branchId)?.branchName || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.resourceType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.maxCapacity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={() => handleSelectResource(r)} className="text-primary hover:text-primary/70" title={t('common.edit')}>
                                                <span className="material-symbols-outlined text-base">edit</span>
                                            </button>
                                            <button onClick={() => handleOpenServicesModal(r)} className="text-primary hover:text-primary/70" title={t('resources.manageServices') || 'Manage services'}>
                                                <span className="material-symbols-outlined text-base">assignment</span>
                                            </button>
                                            <button onClick={() => { handleSelectScheduleResource(r); setShowSheduleModal(true); }} className="text-primary hover:text-primary/70" title={t('common.edit')}>
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

            {/* Modal */}
            {showModal && (

                <>
                    <AddNewResource onShowModal={setShowModal} formData={formData}
                                    previewPhotoUrl={previewPhotoUrl}
                                    sedes={sedes}
                                    validated={false}
                                    onHandleSubmit={handleSubmit}
                                    onHandleInputChange={handleInputChange} 
                                    onHandlePhotoChange={handlePhotoChange} />

                </>
            )}


            {/* Services modal independiente */}
            {showServicesModal && resourceForServices && (

                <AddServiceToResource resourceForServices={resourceForServices} 
                                     servicesTemp={servicesTemp} 
                                     onToggleActive={(serviceId)=> toggleActive(serviceId) } 
                                     onHandleCloseServicesModal={handleCloseServicesModal} 
                                     onHandleSaveServices={handleSaveServices} 
                                     />

            )}

            {/* Service modal de horario */}
            {showScheduleModal && selectScheduleResource && (
                <>
                {/* <ScheduleResourceModal resource={ selectedResource } editableSchedules={editableSchedules} 
                                                          isEditing={isEditing} 
                                                          daysOfWeek={daysOfWeek} 
                                                          onShowModal={(isVisible)=>{setShowModal(isVisible)}} 
                                                          onIsEditing={(isEditing) => {setIsEditing(isEditing)}} 
                                                          onHandleChange={(i,day,value) => handleChange(i, 'dayOfWeek', Number(value))} 
                                                          onHandleAddRow={handleAddRow} 
                                                          onHandleDeleteRow={(rowId) => handleDeleteRow(rowId)} 
                                                          onHandleSave={handleSave} 
                                                          onHandleCancel={handleCancel} 
                                                          /> */}
                
                <ScheduleResource resourceSelected={selectScheduleResource}
                                      showModalSchedule={ (isVisible) => {setShowSheduleModal(isVisible)} }  
                /> 


                </>
            ) }
        </div>
    );
}

export default ResourcesPage;