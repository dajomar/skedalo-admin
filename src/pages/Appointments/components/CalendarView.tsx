import { useTranslation } from "react-i18next";
import type { CalendarViewProps } from "../types";
import { CALENDAR_CONFIG } from "../types";

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

  // Use the same grid template as ResourceHeader so columns align exactly
  const gridTemplate = "grid-cols-[60px_repeat(auto-fill,minmax(150px,1fr))]";

  return (
    <div className="relative overflow-auto border rounded-lg">
      <div className={`min-w-full ${gridTemplate} grid`} style={{ minHeight: Math.min(timelineHeight, 700) }}>
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
              {appointments
                .filter((appointment) => appointment.resourceId === resource.resourceId)
                .map((appointment) => {
                  const startMin = toMinutes(appointment.startTime) - START_HOUR * 60;
                  const endMin = toMinutes(appointment.endTime) - START_HOUR * 60;
                  const top = startMin * PIXELS_PER_MINUTE;
                  const height = (endMin - startMin) * PIXELS_PER_MINUTE;

                  return (
                    <div
                      key={appointment.appointmentId}
                      onClick={() => onAppointmentAction(appointment)}
                      className={
                        `absolute left-1 right-1 text-white text-xs p-2 rounded-md shadow-sm transition-all duration-200
                         ${appointment.status === "P" ? "cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:z-10" : appointment.status === "C" ? "opacity-80" : "opacity-60"}`
                      }
                      style={{ top, height, backgroundColor: getRandomColor() }}
                      title={`${t("client")}: ${appointment.client}\n${t("service")}: ${appointment.serviceName}\n${t("status")}: ${
                        appointment.status === "P" ? t("pending") : appointment.status === "C" ? t("confirmed") : t("canceled")
                      }`}
                    >
                      <div className="font-bold truncate mb-0.5">{appointment.client}</div>
                      <div className="truncate text-[10px] opacity-90">{appointment.serviceName}</div>
                      <div className="text-[10px] flex justify-between items-center mt-1">
                        <span>{appointment.startTime} - {appointment.endTime}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${appointment.status === "P" ? "bg-yellow-500/20" : appointment.status === "C" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                          {appointment.status === "P" && "⏳"}
                          {appointment.status === "C" && "✓"}
                          {appointment.status === "X" && "✕"}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}