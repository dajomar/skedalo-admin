import type { Resources, Schedules } from "@/types";
import BottomSheetModal from "@/components/UI/BottomSheetModal";
import { useTranslation } from "react-i18next";

interface ScheduleResourceModalProps{
    resource:Resources; 
    editableSchedules:Schedules[];
    isEditing:boolean;
    daysOfWeek:string[];
    onShowModal:(isVisible:boolean)  => void; 
    onIsEditing:(isEditing:boolean)  => void; 
    onHandleChange: <K extends keyof Schedules>( index:number, field:K, value:Schedules[K] ) => void;
    onHandleAddRow:() => void;  
    onHandleDeleteRow:( indexToDelete:number ) => void;  
    onHandleSave:() => void;
    onHandleCancel:() => void;



}

export const ScheduleResourceModal = ({resource,
                                      editableSchedules,
                                      isEditing,
                                      daysOfWeek,
                                      onShowModal,
                                      onIsEditing,
                                      onHandleChange,
                                      onHandleAddRow,
                                      onHandleDeleteRow,
                                      onHandleSave,
                                      onHandleCancel
                                }:ScheduleResourceModalProps) => {

    const { t } = useTranslation();


    return (
        <BottomSheetModal
            isOpen={true}
            onClose={() => {
                onShowModal(false);
                onIsEditing(false);
            }}
            title={resource.resourceName}
            subtitle={resource.description || ''}
            icon="schedule"
            maxWidth="4xl"
            footer={
                <div className="p-4 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="text-sm text-gray-600">{t('modal_footnote', 'Changes are saved to this resource only')}</div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => { onHandleCancel(); onShowModal(false); }}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                        >
                            <span className="flex items-center">
                                <span className="material-symbols-outlined text-base mr-1">close</span>
                                {t('cancel', 'Cancel')}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={onHandleSave}
                            disabled={!isEditing}
                            className={`px-4 py-2 rounded-md text-sm text-white ${isEditing ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 text-gray-600'}`}
                        >
                            <span className="flex items-center">
                                <span className="material-symbols-outlined text-base mr-1">save</span>
                                {t('save', 'Save')}
                            </span>
                        </button>
                    </div>
                </div>
            }
        >
            <div className="mb-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">{editableSchedules.length} {t('rows', 'rows')}</div>
                <div className="text-sm text-gray-500">{t('tip_edit', 'Edit entries directly inline')}</div>
            </div>

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    {resource.photoUrl ? (
                        <img src={resource.photoUrl || '../../assets/placeholder.png'} alt="photo" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    ) : (
                        <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl text-gray-500 material-symbols-outlined">person</span>
                    )}
                    <div className="text-sm text-gray-700">#{resource.resourceId}</div>
                </div>
                <button onClick={onHandleAddRow} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-md border border-gray-200">
                    <span className="material-symbols-outlined">add</span>
                    <span>{t('add-row', 'Add Row')}</span>
                </button>
            </div>

            <div className="border rounded-md">
                <div className="hidden md:block">
                    <table className="min-w-full table-auto divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-20">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">{t('day', 'Day')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">{t('start', 'Start')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">{t('end', 'End')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">{t('status', 'Status')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">{t('actions', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {editableSchedules.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 align-top">
                                        <select value={row.dayOfWeek} onChange={(e) => onHandleChange(i, 'dayOfWeek', Number(e.target.value))} className="w-full rounded border border-gray-200 px-2 py-2 text-sm bg-white">
                                            {daysOfWeek.map((d, di) => (
                                                <option key={di} value={di + 1}>{d}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-2">
                                        <input aria-label={`start-${i}`} type="time" value={row.startTime?.slice(0, 5) || ''} onChange={(e) => onHandleChange(i, 'startTime', e.target.value)} className="w-full rounded border border-gray-200 px-2 py-2 text-sm" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input aria-label={`end-${i}`} type="time" value={row.endTime?.slice(0, 5) || ''} onChange={(e) => onHandleChange(i, 'endTime', e.target.value)} className="w-full rounded border border-gray-200 px-2 py-2 text-sm" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <select value={row.status} onChange={(e) => onHandleChange(i, 'status', e.target.value)} className="w-full rounded border border-gray-200 px-2 py-2 text-sm bg-white">
                                            <option value="A">Active</option>
                                            <option value="I">Inactive</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <button title="Delete" onClick={() => onHandleDeleteRow(i)} className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-red-50 text-red-600 hover:bg-red-100">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {editableSchedules.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">{t('no-schedules', 'No schedules defined')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden p-3 space-y-3">
                    {editableSchedules.length === 0 && (
                        <div className="p-4 text-center text-gray-500">{t('no-schedules', 'No schedules defined')}</div>
                    )}

                    {editableSchedules.map((row, i) => (
                        <div key={i} className="bg-white border rounded-lg p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-700">{daysOfWeek[(row.dayOfWeek || 1) - 1]}</div>
                                <div className="flex items-center gap-2">
                                    <button title="Delete" onClick={() => onHandleDeleteRow(i)} className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <label className="text-xs text-gray-500">{t('start', 'Start')}</label>
                                <label className="text-xs text-gray-500">{t('end', 'End')}</label>

                                <input aria-label={`start-mobile-${i}`} type="time" value={row.startTime?.slice(0,5) || ''} onChange={(e) => onHandleChange(i, 'startTime', e.target.value)} className="w-full rounded border border-gray-200 px-2 py-2 text-sm" />
                                <input aria-label={`end-mobile-${i}`} type="time" value={row.endTime?.slice(0,5) || ''} onChange={(e) => onHandleChange(i, 'endTime', e.target.value)} className="w-full rounded border border-gray-200 px-2 py-2 text-sm" />

                                <label className="text-xs text-gray-500">{t('status', 'Status')}</label>
                                <label className="text-xs text-gray-500">{t('day', 'Day')}</label>

                                <select value={row.status} onChange={(e) => onHandleChange(i, 'status', e.target.value)} className="w-full rounded border border-gray-200 px-2 py-2 text-sm bg-white">
                                    <option value="A">Active</option>
                                    <option value="I">Inactive</option>
                                </select>

                                <select value={row.dayOfWeek} onChange={(e) => onHandleChange(i, 'dayOfWeek', Number(e.target.value))} className="w-full rounded border border-gray-200 px-2 py-2 text-sm bg-white">
                                    {daysOfWeek.map((d, di) => (
                                        <option key={di} value={di + 1}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </BottomSheetModal>
    );
}