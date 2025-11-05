import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSedeStore } from "@/store/useSedeStore";
import { useAuthStore } from "@/store/authStore";
import type { AppointmentProjection, Response } from "@/types/index";
import type { Resource } from "./types";
import Swal from "sweetalert2";
import { confirmCanceling, showAlertError } from "@/utils/sweetalert2";
import {
  cancelAppointment,
  confirmAppointment,
  listByDateAndBranch,
} from "@/services/AppointmentsServices";
import "react-day-picker/dist/style.css";

import { HeaderControls } from "./components/HeaderControls";
import { ResourceHeader } from "./components/ResourceHeader";
import { CalendarView } from "./components/CalendarView";
import { formatDate } from "@/helpers/helpers";
import { useNavigate } from "react-router-dom";


export function Appointments() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [appointments, setAppointments] = useState<AppointmentProjection[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
    
  const navigate = useNavigate();
  const { companyId } = useAuthStore();
  const { sedes, listarSedes } = useSedeStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (companyId) {
      listarSedes(companyId);
    }
  }, [companyId, listarSedes]);

  useEffect(() => {
    if (sedes.length > 0 && selectedBranch === null) {
      setSelectedBranch(sedes[0].branchId ?? null);
    }
  }, [sedes]);

  const fetchAppointments = useCallback(async () => {
    
    
    if (!selectedBranch) return;
    
    setIsLoading(true);
    
    try {
      const date = formatDate({day:currentDate.getDate(), month:currentDate.getMonth(), year:currentDate.getFullYear() })  //.toLocaleDateString().split('T')[0];
      
      const appointmentProjection = await listByDateAndBranch(date, selectedBranch);
      setAppointments(appointmentProjection);

      // Extract unique resources from appointments
      const uniqueResources = Array.from(
        new Map(
          appointmentProjection.map((ap: AppointmentProjection) => [
            ap.resourceId,
            {
              resourceId: ap.resourceId,
              resourceName: ap.resourceName,
              imageUrl: ap.photoUrl,
            } as Resource,
          ])
        ).values()
      );
      
      setResources(uniqueResources as Resource[]);
    } catch (error) {
      showAlertError(t("error-loading-appointments"));
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, selectedBranch, t]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);


  const gotToAppointmentsDetails = (appointment: AppointmentProjection) => {

    navigate(`/details/branch/${appointment.branchId}/appointment/${appointment.appointmentId}`, {replace:true} );

  }

  const handleAppointmentAction = async (appointment: AppointmentProjection) => {
    if (appointment.status !== "P"){

        gotToAppointmentsDetails(appointment);
        return;
    } 

    const result = await Swal.fire({
      title: t("confirmOrCancelAppointment"),
      html: `
        <b>${t("client")}:</b> ${appointment.client}<br/>
        <b>${t("serviceName")}:</b> ${appointment.serviceName}<br/>
        <b>${t("hour")}:</b> ${appointment.startTime}<br/>
        <b>${t("phone")}:</b> ${appointment.phoneNumber}<br/>
        <b>${t("email")}:</b> ${appointment.email}
      `,
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: t("confirm"),
      denyButtonText: t("cancel"),
      cancelButtonText: t("close"),
    });

    if (result.isConfirmed) {
      const resp: Response = await confirmAppointment(appointment.appointmentId);
      if (resp?.messageId === "TR000") {
        Swal.fire(t("appointmentConfirmed"), "", "success");
        setAppointments((prev) =>
          prev.map((x) =>
            x.appointmentId === appointment.appointmentId
              ? { ...x, status: "C" }
              : x
          )
        );
      } else {
        showAlertError(resp?.messageText || t("error-operation"));
      }
    } else if (result.isDenied) {
      const ok = await confirmCanceling();
      if (ok) {
        const resp: Response = await cancelAppointment(appointment.appointmentId);
        if (resp?.messageId === "TR000") {
          Swal.fire(t("appointmentCanceled"), "", "success");
          setAppointments((prev) =>
            prev.filter((x) => x.appointmentId !== appointment.appointmentId)
          );
        } else {
          showAlertError(resp?.messageText || t("error-operation"));
        }
      }
    }
  };

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="p-4 space-y-4">
      <HeaderControls
        currentDate={currentDate}
        selectedBranch={selectedBranch}
        branches={sedes}
        onDateChange={setCurrentDate}
        //onDateChange={ console.log }
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onBranchChange={setSelectedBranch}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="relative overflow-auto max-h-[700px] border rounded-lg">
          {/* Resource header sticky at top of the scroll container */}
          <div className="sticky top-0 z-20 bg-white">
            <ResourceHeader resources={resources} />
          </div>

          {/* Calendar grid (will align with header because both use same grid template) */}
          <div>
            <CalendarView
              appointments={appointments}
              resources={resources}
              onAppointmentAction={handleAppointmentAction}
            />
          </div>
        </div>
      )}

      
    </div>
  );
}

export default Appointments;