import Spinner from "@/components/UI/Spinner";
import LoadingSpinner from "@/components/UI/Spinner";
import { capitalizeFirstLetter, formatAvailableTime, formatDateText, formatDuration, sumPropertyFromArray } from "@/helpers/helpers";
import { useAppointmentById } from "@/hooks/useAppointmentById";
import { useBranchByBranchId } from "@/hooks/useBranchByCompany";
import type { Branch } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";



export const AppointmentsDetails = () => {


    const { appointmentId, branchId } = useParams();

    const { appointment, loading: loadingAppointment } = useAppointmentById(Number(appointmentId));

    const { branch } = useBranchByBranchId(Number(branchId));




    if (loadingAppointment) return (<Spinner/>)

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            
            <div className="max-w-4xl mx-auto">
                <div className="layout-content-container  flex flex-col w-full max-w-4xl flex-1">
                    {/* PageHeading  */}
                    {/* <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div className="flex min-w-72 flex-col gap-2">
                    <p
                        className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
                        Appointment Details</p>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">View and
                        manage reservation details below.</p>
                </div>
                <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2">
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    <span className="truncate">Back</span>
                </button>
            </div> */}
                    {/* Main Content Card  */}
                    <div
                        className="w-full bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 lg:p-8">
                        {/* Client Information Section  */}

                        <section>
                            <h2
                                className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-slate-200 dark:border-slate-800">
                                Client Information</h2>
                            <div className="flex py-6 @container">
                                <div
                                    className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                                    <div className="flex gap-4 items-center">
                                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16"
                                            data-alt="Client avatar image" >
                                            {/* style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDrWkg6D4IMSD1-glhmgy40IBK7FSTcA-imNXAZj3hpmhG9cEXyvNGZV2xD4ydsDQh9ucx-CeHspllN1cBmeORwdp1yoRlq-Wrgdp6LGSdpvV5I7kMNkrW8Vw1tKwcXLW1ns9Is577UxlkBMrrg4PjOxj4-WsnDM3jE6lRdF7kmq-6-32HVgCF1csk_l79FSB_FAT1TQpAPVqQQoAz5GAriTYWReERjP7RqExCLvfQOFPBap0TKHdhhRrTwtzXhVZSYGcUmsyqqJ7g");' */}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p
                                                className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
                                                {appointment?.userFirstName} {appointment?.userLastName}
                                            </p>
                                            <p
                                                className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                                                {appointment?.userEmail} | {appointment?.userPhone} </p>
                                        </div>
                                    </div>
                                    {/* Button de ver perfil */}
                                    {/* <button
                                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto gap-2">
                                        <span className="material-symbols-outlined text-xl">person</span>
                                        <span className="truncate">View Profile</span>
                                    </button> */}
                                </div>
                            </div>
                        </section>
                        {/* Appointment Details Section  */}

                        <section className="pt-6 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                <h2
                                    className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                                    Appointment Details</h2>
                                <div
                                    className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-success/10 px-3">
                                    <p className="text-success text-sm font-medium leading-normal">
                                        {appointment?.status === "C" ? (
                                            <span className="material-symbols-outlined text-l px-3 py-1 text-green-500 rounded">check_circle</span>
                                        ) :
                                            <span className="material-symbols-outlined text-l px-3 py-1 text-yellow-500 rounded">hourglass_bottom</span>
                                        }

                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                                <div className="flex items-start gap-3">
                                    <span
                                        className="material-symbols-outlined text-xl text-primary mt-1">design_services</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Service</p>
                                        {appointment?.services.map(service => (
                                            <p key={service.serviceId} className="text-base font-semibold text-slate-800 dark:text-slate-200">
                                                {service.serviceName}
                                            </p>
                                        ))}

                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-xl text-primary mt-1">badge</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Staff Member
                                        </p>
                                        <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{appointment?.resourceName}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span
                                        className="material-symbols-outlined text-xl text-primary mt-1">calendar_today</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Date</p>
                                        <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                                            {formatDateText((appointment?.date))}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-xl text-primary mt-1">schedule</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Time</p>
                                        <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                                            {formatAvailableTime(appointment?.startTime)} - {formatAvailableTime(appointment?.endTime)} </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span
                                        className="material-symbols-outlined text-xl text-primary mt-1">hourglass_top</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Duration</p>
                                        <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{formatDuration(sumPropertyFromArray(appointment?.services, 'durationMinutes'))}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-xl text-primary mt-1">sell</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Price</p>
                                        <p className="text-base font-semibold text-slate-800 dark:text-slate-200">${sumPropertyFromArray(appointment?.services, 'price').toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Notes Section */}
                        <section className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                            <h2
                                className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                                Client Notes</h2>
                            <div
                                className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                                <p className="text-slate-600 dark:text-slate-300 italic">
                                    "..."
                                </p>
                            </div>
                        </section>
                        {/* Business / Location Section  */}
                        <section className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                            <h2
                                className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                                Business &amp; Location</h2>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-xl text-primary mt-1">storefront</span>
                                <div>
                                    <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                                        {branch?.branchName}
                                    </p>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {branch?.address}, {capitalizeFirstLetter(branch?.cities.cityName)}, {capitalizeFirstLetter(branch?.cities.states?.name)}
                                    </p>
                                </div>
                            </div>
                        </section>
                        {/* Action Bar */}
                        {/* <div
                            className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row-reverse gap-3">
                            <button
                                className="flex min-w-[84px] max-w-[480px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2">
                                <span className="material-symbols-outlined text-xl">edit</span>
                                <span className="truncate">Edit Appointment</span>
                            </button>
                            <button
                                className="flex min-w-[84px] max-w-[480px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2">
                                <span className="material-symbols-outlined text-xl">event_repeat</span>
                                <span className="truncate">Reschedule</span>
                            </button>
                            <div className="mr-auto">
                                <button
                                    className="flex min-w-[84px] max-w-[480px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-red text-danger text-sm font-bold leading-normal tracking-[0.015em] gap-2">
                                    <span className="material-symbols-outlined text-xl">cancel</span>
                                    <span className="truncate">Cancel Appointment</span>
                                </button>
                            </div>
                        </div> */}
                    </div >
                </div >
            </div>
        </div>

    )
}

export default AppointmentsDetails;