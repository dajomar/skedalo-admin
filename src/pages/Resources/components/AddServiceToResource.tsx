import type { Resources, Services } from "@/types";
import BottomSheetModal from "@/components/UI/BottomSheetModal";
import { useTranslation } from "react-i18next";

interface AddServiceToResourceProps {
    isOpen: boolean;
    onClose: () => void;
    resourceForServices: Resources;
    servicesTemp: Services[];
    onToggleActive: (serviceId: number) => void;
    onHandleSaveServices: () => void;
}


export const AddServiceToResource = ({
    isOpen,
    onClose,
    servicesTemp,
    resourceForServices,
    onToggleActive,
    onHandleSaveServices,
}: AddServiceToResourceProps) => {

    const { t } = useTranslation();



    return (
        <BottomSheetModal
            isOpen={isOpen}
            onClose={onClose}
            title={t('resources.assignServices', 'Assign services')}
            subtitle={resourceForServices.resourceName}
            icon="assignment"
            maxWidth="md"
            footer={
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        <span className="flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg mr-2">close</span>
                            {t('cancel', 'Cancel')}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={onHandleSaveServices}
                        className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                        <span className="flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg mr-2">save</span>
                            {t('save', 'Save')}
                        </span>
                    </button>
                </div>
            }
        >
            {/* Selected services chips */}
            {servicesTemp.some((srv) => srv.status === 'A') && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        {t('resources.selectedServices', 'Selected services')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {servicesTemp
                            .filter((srv) => srv.status === 'A')
                            .map((srv) => (
                                <div
                                    key={srv.serviceId}
                                    className="flex items-center gap-1 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full"
                                >
                                    <span className="truncate max-w-[10rem]">{srv.serviceName}</span>
                                    <button
                                        onClick={() => onToggleActive(srv.serviceId!)}
                                        className="text-primary/70 hover:text-primary"
                                        aria-label={t('remove', 'Remove') || 'Remove'}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Services list */}
            <div className="max-h-72 overflow-auto border rounded-md p-2">
                {servicesTemp.length === 0 ? (
                    <div className="text-sm text-gray-500">
                        {t('resources.noServices', 'No services available')}
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
                                        {srv.durationMinutes ? `${srv.durationMinutes} min` : ''}
                                    </div>
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </BottomSheetModal>
    );
}