import type { Resources, Schedules } from "@/types";
import { t } from "i18next";

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



    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" role="presentation">
                    <div className="absolute inset-0 bg-black/40" onClick={() => { onShowModal(false); onIsEditing(false); }} />
                    <div role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title" className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl z-10 p-0 overflow-hidden">

                        {/* header */}
                        <div className="flex items-center justify-between gap-4 p-5 border-b">
                            <div className="flex items-center gap-4">
                                {resource.photoUrl ? (
                                    <img src={resource.photoUrl || '../../assets/placeholder.png'} alt="photo" className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                                ) : (
                                    <span className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-500 material-symbols-outlined">person</span>
                                )}

                                <div>
                                    <h3 id="schedule-modal-title" className="text-lg font-semibold text-gray-800 leading-tight">
                                        {resource.resourceName}
                                    </h3>
                                    <p className="text-sm text-gray-500">{resource.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-2">
                                <button onClick={onHandleAddRow} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-md border border-gray-200">
                                    <span className="material-symbols-outlined">add</span>
                                    <span>{t('add-row', 'Add Row')}</span>
                                </button>

                                <button onClick={onHandleSave} className={`inline-flex items-center px-4 py-2 rounded-md text-sm text-white ${isEditing ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`} disabled={!isEditing}>{t('save', 'Save')}</button>
                            </div>
                        </div>

                        {/* body */}
                        <div className="p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="text-sm text-gray-600">{editableSchedules.length} {t('rows', 'rows')}</div>
                                <div className="text-sm text-gray-500">{t('tip_edit', 'Edit entries directly inline')}</div>
                            </div>

                            <div className="overflow-auto max-h-[60vh] border rounded-md">
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
                        </div>

                        <div className="p-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div className="text-sm text-gray-600">{t('modal_footnote', 'Changes are saved to this resource only')}</div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { onHandleCancel(); onShowModal(false); }} className="px-4 py-2 bg-gray-100 rounded-md text-sm">{t('cancel', 'Cancel')}</button>
                                <button onClick={onHandleSave} className={`px-4 py-2 rounded-md text-sm text-white ${isEditing ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 text-gray-600'}`} disabled={!isEditing}>{t('save', 'Save')}</button>
                            </div>
                        </div>
                    </div>
                </div>
    )
}