import { useTranslation } from 'react-i18next';
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { es, fr, enUS } from 'date-fns/locale';
import { format } from 'date-fns';
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

    const prueba = (date: any) => {

        console.log('preba', date)
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5 bg-white p-4 rounded-lg shadow-sm">
            {/* Calendar and navigation controls */}
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                    <button
                        onClick={onPrevDay}
                        className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-gray-900"
                        aria-label={t('previousDay')}
                    >
                        {/* <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg> */}

                        <span className="material-symbols-outlined w-5 h-5 "> chevron_left</span>
                        
                    </button>

                    <div className="relative group">
                        <button
                            className="px-4 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-900 font-medium min-w-[150px] text-center"
                            onClick={() => document.getElementById('calendar-popup')?.classList.toggle('hidden')}
                        >
                            {format(currentDate, 'MMMM d, yyyy', { locale: getLocale() })}
                        </button>

                        {/* Calendar Popup */}
                        <div
                            id="calendar-popup"
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg p-2 z-30 hidden"
                        >
                            <DayPicker
                                animate
                                mode="single"
                                selected={currentDate}
                                onSelect={(date: Date | undefined) => {
                                    if (date) {
                                        onDateChange(date);
                                        document.getElementById('calendar-popup')?.classList.add('hidden');
                                    }
                                }}
                                locale={getLocale()}
                                className="!p-0"
                                modifiers={{ today: new Date() }}
                                modifiersStyles={{
                                    today: {
                                        fontWeight: 'bold',
                                        color: 'bg-primary'
                                    }
                                }}
                                styles={{
                                    head_cell: { color: '#6b7280' },
                                    caption: { color: '#111827' }
                                }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={onNextDay}
                        className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-gray-900"
                        aria-label={t('nextDay')}
                    >
                        {/* <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg> */}
                        <span className="material-symbols-outlined w-5 h-5 "> chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Branch selector */}
            <div className="relative min-w-[200px]">
                <label htmlFor="branch-select" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('branch')}
                </label>
                <div className="relative">
                    <select
                        id="branch-select"
                        value={selectedBranch ?? ''}
                        onChange={(e) => onBranchChange(Number(e.target.value))}
                        className="
              block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
              focus:ring-blue-500 focus:border-blue-500 rounded-lg transition-shadow
              bg-white hover:bg-gray-50 cursor-pointer appearance-none
            "
                    >
                        {branches.map((branch) => (
                            <option key={branch.branchId} value={branch.branchId || ''}>
                                {branch.branchName}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        {/* <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                         */}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}