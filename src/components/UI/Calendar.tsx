import { use, useEffect, useState } from "react";

export default function Calendar ({ date, onDateSelect }: { date?:Date; onDateSelect?: (date: any) => void }) {
  const [currentDate, setCurrentDate] = useState( new Date());
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  useEffect(() => { 
    
    handleDateSelect(today.getDate());
    },[]);

    useEffect(() => {
        if (!date) return;
       handleDateSelect(date.getDate());
        console.log("date changed in calendar:", date);
        if (onDateSelect && selectedDate){
          onDateSelect(new Date(selectedDate.year, selectedDate.month , selectedDate.day ));  
    } 
    }, [date]);

useEffect(() => {
    if (onDateSelect && selectedDate){
      onDateSelect(new Date(selectedDate.year, selectedDate.month , selectedDate.day ));  
}
}, [selectedDate]);


  const handleDateSelect = (day: number) => {
    const dateSel = { day, month, year };
    setSelectedDate(dateSel);
    
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Calendar</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-gray-600">chevron_left</span>
          </button>
          <span className="font-semibold text-gray-700 capitalize">
            {monthName} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-gray-600">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          if (!day)
            return (
              <div key={idx} className="p-2 text-center text-gray-300">
                {/* espacio vacío */}
              </div>
            );

          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          const isSelected =
            selectedDate?.day === day &&
            selectedDate?.month === month &&
            selectedDate?.year === year;

          return (
            <div key={idx} className="relative">
              <button
                onClick={() => handleDateSelect(day)}
                className={`p-2 w-full text-center rounded-full transition-colors duration-200
                  ${
                    isSelected
                      ? "bg-primary text-white font-semibold"
                      : isToday
                      ? "border border-primary text-primary font-semibold"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
              >
                {day}
              </button>
              {/* Ejemplo de punto debajo de ciertos días */}
              {(day === 5 || day === 10 || day === 23) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}