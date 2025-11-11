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
import { ScheduleResourceModal } from "../Resources/components/ScheduleResourceModal";



export const ScheduleResource = ( {resourceSelected,showModalSchedule, }:{resourceSelected:Resources | null; showModalSchedule:(isVisible:boolean) => void} ) => {

    const { t } = useTranslation();
    const { schedules, setSelectedResourceId, listByResource, saveList } = useSchedulesStore();
    const { resources, listResourcesByCompany } = useResourcesStore();
    const { sedes, listarSedes } = useSedeStore();
    const { companyId } = useAuthStore();

    const [showModal, setShowModal] = useState(false);
    const [selectedResource, setSelectedResource] = useState<Resources | null>(resourceSelected);
    const [selectedSede, setSelectedSede] = useState<Branches | null>(null);
    const [editableSchedules, setEditableSchedules] = useState<Schedules[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(()=>{

        

    },[showModal])

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
            showModalSchedule( false );
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


    return (
        <>
            {/* Modal: Edit schedules for selected resource */}
            {  selectedResource && (

                <>
                    <ScheduleResourceModal resource={ selectedResource } editableSchedules={editableSchedules} 
                                          isEditing={isEditing} 
                                          daysOfWeek={daysOfWeek} 
                                          onShowModal={(isVisible)=>{showModalSchedule(isVisible)}} 
                                          onIsEditing={(isEditing) => {setIsEditing(isEditing)}} 
                                          onHandleChange={(i,field,value) => handleChange(i, field, value)} 
                                          onHandleAddRow={handleAddRow} 
                                          onHandleDeleteRow={(rowId) => handleDeleteRow(rowId)} 
                                          onHandleSave={handleSave} 
                                          onHandleCancel={handleCancel} 
                                          />
                </>

            )}
        </>
    );
};

export default ScheduleResource;