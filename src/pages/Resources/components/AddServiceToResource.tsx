import type { Resources, Services } from "@/types";
import { t } from "i18next";

interface AddServiceToResourceProps {
    resourceForServices:Resources;
    servicesTemp:Services[];
    onToggleActive:(serviceId:number) => void; 
    onHandleCloseServicesModal:(isVisible:boolean) => void; 
    onHandleSaveServices:()=>void; 

}


export const AddServiceToResource = (
        {
         servicesTemp,
         resourceForServices,
         onToggleActive,
         onHandleCloseServicesModal,
         onHandleSaveServices,
        }:AddServiceToResourceProps) => {



    return (

         <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => { onHandleCloseServicesModal(false)}}
                    />
                    <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-lg p-6">
                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl shadow-sm">
                                <img
                                    src={resourceForServices.photoUrl || '/placeholder.png'}
                                    alt="photo"
                                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                        {t('resources.assignServices')}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {resourceForServices.resourceName}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => { onHandleCloseServicesModal(false)}}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* SERVICIOS SELECCIONADOS */}
                        {servicesTemp.some((srv) => srv.status === 'A') && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    {t('resources.selectedServices') || 'Services sélectionnés'}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {servicesTemp
                                        .filter((srv) => srv.status === 'A')
                                        .map((srv) => (
                                            <div
                                                key={srv.serviceId}
                                                className="flex items-center gap-1 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full"
                                            >
                                                <span>{srv.serviceName}</span>
                                                <button
                                                    onClick={() => onToggleActive(srv.serviceId!)}
                                                    className="text-primary/70 hover:text-primary"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* LISTA DE SERVICIOS */}
                        <div className="max-h-72 overflow-auto border rounded-md p-2">
                            {servicesTemp.length === 0 ? (
                                <div className="text-sm text-gray-500">
                                    {t('resources.noServices') || 'No services available'}
                                </div>
                            ) : (
                                <ul className="space-y-2">
                                    {servicesTemp.map((srv) => (
                                        <li
                                            key={srv.serviceId}
                                            className="flex items-center justify-between"
                                        >
                                            <label className="flex items-center space-x-3 cursor-pointer w-full">
                                                <input
                                                    type="checkbox"
                                                    checked={srv.status === 'A'}
                                                    onChange={() => onToggleActive(srv.serviceId!)}
                                                    className="h-4 w-4 text-primary border-gray-300 rounded"
                                                />
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {srv.serviceName}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {srv.description}
                                                    </div>
                                                </div>
                                                <div className="ml-2 text-xs text-gray-500">
                                                    {srv.durationMinutes
                                                        ? `${srv.durationMinutes} min`
                                                        : ''}
                                                </div>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* BOTONES */}
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={() => { onHandleCloseServicesModal(false)}}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={onHandleSaveServices}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                {t('common.save')}
                            </button>
                        </div>
                    </div>
                </div>
    )
}