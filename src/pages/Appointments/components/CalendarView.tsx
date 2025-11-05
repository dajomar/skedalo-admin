import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type { CalendarViewProps } from "../types";
import { CALENDAR_CONFIG } from "../types";
import { formatAvailableTime } from "@/helpers/helpers";

const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const getRandomColor = () =>
  CALENDAR_CONFIG.COLORS[Math.floor(Math.random() * CALENDAR_CONFIG.COLORS.length)];

export function CalendarView({ appointments, resources, onAppointmentAction }: CalendarViewProps) {
  const { START_HOUR, END_HOUR, PIXELS_PER_MINUTE } = CALENDAR_CONFIG;
  const totalHours = END_HOUR - START_HOUR;
  const totalMinutes = totalHours * 60;
  const timelineHeight = totalMinutes * PIXELS_PER_MINUTE; // px
  const { t } = useTranslation();

  const [currentTimePosition, setCurrentTimePosition] = useState<number>(0);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const totalCurrentMinutes = (currentHour * 60 + currentMinutes) - (START_HOUR * 60);
      setCurrentTimePosition(totalCurrentMinutes * PIXELS_PER_MINUTE);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [START_HOUR, PIXELS_PER_MINUTE]);

  // Calcula el ancho dinámico igual que ResourceHeader
  const minWidth = 150;
  const total = resources.length;
  const gridTemplateColumns = `60px repeat(${total}, minmax(${minWidth}px, 1fr))`;

  return (
    <div className="min-w-full grid" style={{ gridTemplateColumns, minHeight: Math.min(timelineHeight, 700) }}>
        {/* Hour column */}
        <div className="border-r bg-white sticky left-0 z-10" style={{ height: timelineHeight }}>
          <div className="relative h-full">
            {Array.from({ length: totalHours }, (_, i) => (
              <div
                key={i}
                className="relative border-t text-gray-500 text-xs flex items-start justify-center pt-2 font-semibold"
                style={{ height: 60 * PIXELS_PER_MINUTE }}
              >
                {String(START_HOUR + i).padStart(2, "0")}:00
                {/* <div className="absolute top-[30px] w-full text-[10px] text-gray-400 flex justify-center">30</div> */}
              </div>
            ))}
          </div>
        </div>

        {/* Resource columns - each is a grid cell so widths match ResourceHeader */}
        {resources.map((resource) => (
          <div
            key={resource.resourceId}
            className="relative border-r"
            style={{ height: timelineHeight }}
          >
            {/* timeline area for this resource */}
            <div className="relative h-full">
              {/* Grid lines for hours and half hours */}
              <div className="absolute inset-0">
                {Array.from({ length: totalHours * 2 }, (_, i) => (
                  <div
                    key={i}
                    className={`absolute w-full ${i % 2 === 0 ? 'border-t border-gray-200' : 'border-t border-gray-100'}`}
                    style={{ top: (i * 30) * PIXELS_PER_MINUTE }}
                  />
                ))}
              </div>
              
              {/* Current time line */}
              {currentTimePosition > 0 && currentTimePosition < timelineHeight && (
                <div 
                  className="absolute w-full z-20 flex items-center"
                  style={{ top: currentTimePosition }}
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                  <div className="flex-1 border-t border-red-500" />
                </div>
              )}

              {appointments
                .filter((appointment) => appointment.resourceId === resource.resourceId)
                .map((appointment) => {
                  const startMin = toMinutes(appointment.startTime) - START_HOUR * 60;
                  const endMin = toMinutes(appointment.endTime) - START_HOUR * 60;
                  const top = startMin * PIXELS_PER_MINUTE;
                  const height =  ((endMin - startMin) * PIXELS_PER_MINUTE) === 60 ? 70 :(endMin - startMin) * PIXELS_PER_MINUTE ;
                  const compactThreshold = 36; // px
                  const isCompact = height < compactThreshold;

                  

                  return (
                    <div
                        key={appointment.appointmentId}
                        onClick={() => onAppointmentAction(appointment)}
                        className={
                          `absolute left-1 right-1 text-white text-xs p-2 rounded-md shadow-sm transition-all duration-200 overflow-hidden
                           ${appointment.status === "P" ? "cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:z-10" : appointment.status === "C" ? "opacity-80" : "opacity-60"}`
                        }
                        style={{ top, height: Math.max(height, 28), minHeight: 28, backgroundColor: getRandomColor() }}
                      title={`${t("client")}: ${appointment.client}\n${t("service")}: ${appointment.serviceName}\n${t("status")}: ${
                        appointment.status === "P" ? t("pending") : appointment.status === "C" ? t("confirmed") : t("canceled")
                      }`}
                    >
                      {isCompact ? (
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-medium">{appointment.client} - {formatAvailableTime(appointment.startTime)} - {appointment.serviceName}</span>
                          <span className={` material-symbols-outlined px-1 py-0.5 rounded text-[14px]`}>{appointment.status === "P" ? "⏳" : appointment.status === "C" ? "check_circle" : "close"}</span>
                        </div>
                      ) : (
                        <>
                          <div className="font-bold truncate mb-0.5">{appointment.client}</div>
                          <div className="truncate text-[10px] opacity-90">{appointment.serviceName}</div>
                          <div className="text-[10px] flex justify-between items-center mt-1">
                            <span>{formatAvailableTime(appointment.startTime)} - {formatAvailableTime(appointment.endTime)}</span>
                            <span className={`material-symbols-outlined px-1.5 py-0.5 rounded-full text-[14px] font-medium ${appointment.status === "P" ? "bg-yellow-500/20" : appointment.status === "C" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                              {appointment.status === "P" && "⏳"}
                              {appointment.status === "C" && "check_circle"}
                              {appointment.status === "X" && "close"}
                              
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
    </div>
  );
}