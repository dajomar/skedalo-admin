
import Calendar from '@/components/UI/Calendar';
import { useTranslation } from 'react-i18next'

import { Link } from 'react-router-dom';
import { UpcomingAppointments } from './components/UpcomingAppointments';
import { useSedeStore } from '@/store/useSedeStore';
import { useState, useEffect, use } from 'react';
import { useAuthStore } from '@/store/authStore';
import { set } from 'zod';
import { BranchSelector } from '@/components/UI/BranchSelector';


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
    // useEffect(() => {
    //     if (sedes.length > 0 && selectedBranch === null) {
    //         setSelectedBranch(sedes[0].branchId ?? null);
    //     }
    // }, [sedes, selectedBranch]);

    useEffect(() => {
        
    }   , [selectedDate]);

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
                        <BranchSelector branches={sedes} onBranchSelected={(branch) => {setSelectedBranch(branch || null)}} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* calendar */}


                    <Calendar date={calendarDay} onDateSelect={(dateSelected) => {setSelectedDate(dateSelected)}} />
                    

                    <UpcomingAppointments date={selectedDate} branchId={selectedBranch ?? undefined} onDateSelected={(dateSelected)=>  setCalendarDay(dateSelected) } />

                </div>
            </div>

        </>
    )


}
