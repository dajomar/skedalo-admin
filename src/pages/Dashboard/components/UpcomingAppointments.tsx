  import { formatAvailableTime } from "@/helpers/helpers";
  import { cancelAppointment, confirmAppointment, listByDateAndBranch } from "@/services/AppointmentsServices";
  import { useAuthStore } from "@/store/authStore";
  import { useSedeStore } from "@/store/useSedeStore";
  import type { AppointmentProjection, Response,Resources } from "@/types";
  import { confirmCanceling, showAlertError } from "@/utils/sweetalert2";
  import { useEffect, useState } from "react";
  import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
  import Swal from "sweetalert2";

  type LocalResource = { resourceId: number; resourceName: string; imageUrl?: string };

  type Props = {
    date?: Date;
    branchId?: number;
    onDateSelected?: (date: Date) => void;
    onConfirmed?: (appointment: AppointmentProjection) => void;
    onCanceled?: (appointment: AppointmentProjection) => void;
  };

  export const UpcomingAppointments = ({ date, branchId, onConfirmed, onCanceled, onDateSelected }: Props) => {
    const { t } = useTranslation();

    const [resources, setResources] = useState<LocalResource[]>([]);
    const [appointments, setAppointments] = useState<AppointmentProjection[]>([]);
    const [currentDate, setCurrentDate] = useState<Date>(date ?? new Date());
    const { companyId } = useAuthStore();
    const { sedes, listarSedes } = useSedeStore();
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(date ?? new Date());
    

    // Load branches
    useEffect(() => {
      if (companyId) listarSedes(companyId);
    }, [companyId, listarSedes]);

    // Select default branch when available
    useEffect(() => {
      if (sedes.length > 0 && selectedBranch === null) {
        setSelectedBranch(sedes[0].branchId ?? null);
      }
    }, [sedes, selectedBranch]);

    // Sync when prop date changes
    useEffect(() => {
      if (date) setCurrentDate(date);
    }, [date]);

    // Fetch appointments for the selected date & branch (branch prop overrides store)
    useEffect(() => {
      const fetchAppointments = async () => {
        const branchToUse = branchId ?? selectedBranch;
        if (!branchToUse) return;

        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
        const dd = String(currentDate.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;

        try {
          const appointmentProjection: AppointmentProjection[] = await listByDateAndBranch(dateStr, branchToUse);
          setAppointments(appointmentProjection);
          const uniqueResources: LocalResource[] = Array.from(
            new Map(
              appointmentProjection.map((ap) => [
                ap.resourceId,
                { resourceId: ap.resourceId, resourceName: ap.resourceName, imageUrl: ap.photoUrl || undefined },
              ])
            ).values()
          );
          
        } catch (err) {
          console.error(err);
        }
      };

      fetchAppointments();
    }, [currentDate, selectedBranch, branchId]);

    useEffect(() => {
        if(onDateSelected) onDateSelected(selectedDate);
    }, [selectedDate]);


    // Navigation handlers
    const handlePrevDay = () => setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      setSelectedDate(d);
      return d;
    });

    const handleNextDay = () => setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);

     setSelectedDate(d);

      return d;
    });

    const confirmOrCancel = async (appointment: AppointmentProjection): Promise<void> => {
      if (appointment.status !== "P") return; // only pending

      const result = await Swal.fire({
        title: t("confirmOrCancelAppointment"),
        icon: "question",
        html: `
          <b> ${t("client")}: </b> ${appointment.client}
          <br/>
          <b> ${t("serviceName")}: </b> ${appointment.serviceName}
          <br/>
          <b> ${t("hour")}: </b> ${formatAvailableTime(appointment.startTime)}
          <br/>
          <b> ${t("phone")}: </b> ${appointment.phoneNumber}
          <br/>
          <b> ${t("email")}: </b> ${appointment.email}
        `,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: t("confirm"),
        denyButtonText: t("cancel"),
        cancelButtonText: t("close"),
      });

      if (result.isConfirmed) {
        const resp: Response = await confirmAppointment(appointment.appointmentId);
        if (resp && resp.messageId === "TR000") {
          Swal.fire(t("appointmentConfirmed"), "", "success");
          setAppointments((prev) => prev.map((a) => (a.appointmentId === appointment.appointmentId ? { ...a, status: "C" } : a)));
          if (onConfirmed) onConfirmed({ ...appointment, status: "C" });
        } else if (resp) {
          showAlertError(resp.messageText);
        } else {
          showAlertError(t("error-operation"));
        }
      } else if (result.isDenied) {
        const resultConfirm = await confirmCanceling();
        if (resultConfirm) {
          const resp: Response = await cancelAppointment(appointment.appointmentId);
          if (resp && resp.messageId === "TR000") {
            Swal.fire(t("appointmentCanceled"), "", "success");
            setAppointments((prev) => prev.filter((a) => a.appointmentId !== appointment.appointmentId));
            if (onCanceled) onCanceled(appointment);
          } else if (resp) {
            showAlertError(resp.messageText);
          } else {
            showAlertError(t("error-operation"));
          }
        }
      }
    };

    const isToday = (apDate: string) => apDate === new Date().toISOString().slice(0, 10);

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{t('upcoming-appointments','Upcoming Appointments')}</h3>
          {/* <div className="flex items-center gap-3">
            <button onClick={handlePrevDay} className="p-1 rounded-full hover:bg-gray-100">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="text-sm font-medium">{currentDate.toLocaleDateString()}</div>
            <button onClick={handleNextDay} className="p-1 rounded-full hover:bg-gray-100">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div> */}
        </div>

        <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
          {appointments.length === 0 && (
            <div className="text-center text-gray-500 py-6">{t('no-appointments','No appointments for this day')}</div>
          )}

          {appointments.slice(0,6).map((ap) => (
            
            <div key={ap.appointmentId} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg" >
              <img alt="Client avatar" className="h-12 w-12 rounded-full object-cover" src={ap.photoUrl || ''} />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{ap.client}</p>
                <p className="text-sm text-gray-500">{ap.serviceName} • {ap.resourceName}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${ap.status === 'P' ? 'text-primary' : 'text-gray-700'}`}>{formatAvailableTime(ap.startTime)}</p>
                <p className="text-xs text-gray-500">{isToday(ap.appointmentDate) ? t('today','Today') : ap.appointmentDate}</p>
                <div className="mt-2">
                    
                    <Link to={`/details/branch/${ap.branchId}/appointment/${ap.appointmentId}`}
                          className="text-sm px-3 py-1 bg-white border rounded text-gray-700 hover:bg-gray-100 mr-1">{t('details','Details')}</Link>
                    {ap.status === "P" ? (
                        <button onClick={() => confirmOrCancel(ap)} className="text-sm px-3 py-1 bg-white border rounded text-gray-700 hover:bg-gray-100">{t('manage','Manage')}</button>
                    ): ( ap.status === "C" ? (
                        
                        <span className="material-symbols-outlined text-l px-3 py-1 text-green-500 rounded">check_circle</span>
                    ) : (
                        <span className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded">{t('canceled','Canceled')}</span>
                    ))}
                    
                </div>
              </div>
            </div>
          ))}
        </div>

          {appointments.length > 5 && (
            <button className="mt-4 w-full text-primary font-semibold py-2 rounded-lg hover:bg-primary/5">{t('view-all','View all appointments')}</button>
          )}
        
      </div>
    );
  };

  export default UpcomingAppointments;

