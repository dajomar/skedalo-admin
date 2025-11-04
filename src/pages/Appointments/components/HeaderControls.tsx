import { useTranslation } from 'react-i18next';
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { es, fr, enUS } from 'date-fns/locale';
import type { HeaderControlsProps } from '../types';
import i18next from 'i18next';

export function HeaderControls({
  currentDate,
  selectedBranch,
  branches,
  onDateChange,
  onPrevDay,
  onNextDay,
  onBranchChange
}: HeaderControlsProps) {
  const { t } = useTranslation();

  const getLocale = () => {
    switch (i18next.language) {
      case 'en':
        return enUS;
      case 'fr':
        return fr;
      default:
        return es;
    }
  };

  const prueba = (date:any) => {

    console.log('preba',date)
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mb-5">
      <button
        onClick={onPrevDay}
        className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition-colors"
        aria-label={t('previousDay')}
      >
        ◀
      </button>
      
      <div className="bg-white rounded-lg shadow px-3 py-2">
        <DayPicker
          animate
          mode="single"
          selected={currentDate}
          onSelect={(date: Date | undefined) => date && onDateChange(date)}
          locale={getLocale()}
          className="!p-0"
          modifiers={{
            today: new Date(),
          }}
          modifiersStyles={{
            today: {
              fontWeight: 'bold',
              color: '#0ea5e9'
            }
          }}
        />
      </div>

      <button
        onClick={onNextDay}
        className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition-colors"
        aria-label={t('nextDay')}
      >
        ▶
      </button>

      <div className="flex items-center gap-2">
        <label htmlFor="branch-select" className="font-medium">
          {t('branch')}
        </label>
        <select
          id="branch-select"
          value={selectedBranch ?? ''}
          onChange={(e) => onBranchChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {branches.map((branch) => (
            <option key={branch.branchId} value={branch.branchId || ''}>
              {branch.branchName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}