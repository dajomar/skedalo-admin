
import Calendar from '@/components/UI/Calendar';
import { useTranslation } from 'react-i18next'

import { Link } from 'react-router-dom';
import { UpcomingAppointments } from './components/UpcomingAppointments';
import { useSedeStore } from '@/store/useSedeStore';
import { useState, useEffect, use } from 'react';
import { useAuthStore } from '@/store/authStore';
import { set } from 'zod';


export default function DashBoard() {
    const { t } = useTranslation();
    const { sedes, listarSedes } = useSedeStore();
    const { companyId } = useAuthStore();
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [ calendarDay , setCalendarDay ] = useState<Date>(new Date());

    // Load branches for company on mount
    useEffect(() => {
        if (companyId) listarSedes(companyId);
    }, [companyId, listarSedes]);

    // Set default selected branch when sedes load
    useEffect(() => {
        if (sedes.length > 0 && selectedBranch === null) {
            setSelectedBranch(sedes[0].branchId ?? null);
        }
    }, [sedes, selectedBranch]);

    useEffect(() => {
        
    }   , [selectedDate]);

    const prueba = (date:any) => {

        
        setCalendarDay(date);

    }

    return (
        <>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Appointments</p>
                            <p className="text-3xl font-bold text-gray-800">1,250</p>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-full">
                            <span className="material-symbols-outlined text-primary">event_available</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending Requests</p>
                            <p className="text-3xl font-bold text-gray-800">12</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <span className="material-symbols-outlined text-yellow-500">pending_actions</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">New Clients</p>
                            <p className="text-3xl font-bold text-gray-800">35</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <span className="material-symbols-outlined text-green-500">person_add</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Revenue</p>
                            <p className="text-3xl font-bold text-gray-800">$5,430</p>
                        </div>
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <span className="material-symbols-outlined text-indigo-500">payments</span>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="branch_select"
                            className="text-sm font-medium text-gray-700"
                        >
                            {t('branch', 'Branch')}:
                        </label>

                        <div className="relative">
                            <select
                                id="branch_select"
                                value={selectedBranch != null ? String(selectedBranch) : ''}
                                onChange={(e) =>
                                    setSelectedBranch(e.target.value ? Number(e.target.value) : null)
                                }
                                className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm 
                   focus:border-primary focus:ring-2 focus:ring-primary/30 transition duration-150 ease-in-out cursor-pointer"
                            >
                                <option value="">{t('select-branch', 'All branches')}</option>
                                {sedes.map((s) => (
                                    <option
                                        key={s.branchId}
                                        value={s.branchId != null ? String(s.branchId) : ''}
                                    >
                                        {s.branchName}
                                    </option>
                                ))}
                            </select>

                            {/* Icono de flecha */}
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <svg
                                    className="h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* calendar */}


                    <Calendar date={calendarDay} onDateSelect={(dateSelected) => {setSelectedDate(dateSelected)}} />
                    {/* <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Calendar</h3>
                            <div className="flex items-center space-x-2">
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                    <span className="material-symbols-outlined text-gray-600">chevron_left</span>
                                </button>
                                <span className="font-semibold text-gray-700">October 2023</span>
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                    <span className="material-symbols-outlined text-gray-600">chevron_right</span>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            <div className="text-gray-400 p-2 text-center">29</div>
                            <div className="text-gray-400 p-2 text-center">30</div>
                            <div className="p-2 text-center text-gray-800">1</div>
                            <div className="p-2 text-center text-gray-800 relative">2<span
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-red-500 rounded-full"></span>
                            </div>
                            <div className="p-2 text-center text-gray-800">3</div>
                            <div className="p-2 text-center text-gray-800">4</div>
                            <div className="p-2 text-center text-gray-800 relative">5<span
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></span>
                            </div>
                            <div className="p-2 text-center text-gray-800">6</div>
                            <div className="p-2 text-center text-gray-800">7</div>
                            <div className="p-2 text-center text-gray-800">8</div>
                            <div className="p-2 text-center text-gray-800">9</div>
                            <div className="p-2 text-center text-gray-800 relative">10<span
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></span>
                            </div>
                            <div className="p-2 text-center text-gray-800 bg-primary text-white rounded-full">11</div>
                            <div className="p-2 text-center text-gray-800">12</div>
                            <div className="p-2 text-center text-gray-800">13</div>
                            <div className="p-2 text-center text-gray-800 relative">14<span
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-green-500 rounded-full"></span>
                            </div>
                            <div className="p-2 text-center text-gray-800">15</div>
                            <div className="p-2 text-center text-gray-800">16</div>
                            <div className="p-2 text-center text-gray-800">17</div>
                            <div className="p-2 text-center text-gray-800">18</div>
                            <div className="p-2 text-center text-gray-800">19</div>
                            <div className="p-2 text-center text-gray-800">20</div>
                            <div className="p-2 text-center text-gray-800">21</div>
                            <div className="p-2 text-center text-gray-800">22</div>
                            <div className="p-2 text-center text-gray-800 relative">23<span
                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></span>
                            </div>
                            <div className="p-2 text-center text-gray-800">24</div>
                            <div className="p-2 text-center text-gray-800">25</div>
                            <div className="p-2 text-center text-gray-800">26</div>
                            <div className="p-2 text-center text-gray-800">27</div>
                            <div className="p-2 text-center text-gray-800">28</div>
                            <div className="p-2 text-center text-gray-800">29</div>
                            <div className="p-2 text-center text-gray-800">30</div>
                            <div className="p-2 text-center text-gray-800">31</div>
                            <div className="text-gray-400 p-2 text-center">1</div>
                            <div className="text-gray-400 p-2 text-center">2</div>
                        </div>
                    </div> */}



                    <UpcomingAppointments date={selectedDate} branchId={selectedBranch ?? undefined} onDateSelected={(dateSelected)=>  prueba(dateSelected) } />

                </div>
            </div>

        </>
    )


}
