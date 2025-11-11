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
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => { onShowModal(false); onIsEditing(false); }} />
                    <div className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg z-10 p-6 overflow-hidden">

                        {/* header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4 p-3  rounded-xl shadow-sm">

                                {resource.photoUrl ? (
                                    <img src={resource.photoUrl || '../../assets/placeholder.png'} alt="photo" className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                                ) : (
                                    <span className="flex-shrink-0 text-4xl rounded-full bg-cover bg-center material-symbols-outlined dark:text-text-dark"> person </span>
                                )}


                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                        {resource.resourceName}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {resource.description}
                                    </span>
                                </div>


                            </div>

                            <div className="p-4  flex items-center justify-between">


                                <div className="flex items-center gap-2">
                                    <button onClick={onHandleAddRow} className="px-3 py-1 bg-gray-100 rounded">{t('add-row', 'Add Row')}</button>
                                    <button onClick={onHandleSave} className={`px-4 py-2 rounded text-white ${isEditing ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`} disabled={!isEditing}>{t('save', 'Save')}</button>
                                </div>
                            </div>

                        </div>





                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs text-gray-500">{t('day', 'Day')}</th>
                                            <th className="px-4 py-2 text-left text-xs text-gray-500">{t('start', 'Start')}</th>
                                            <th className="px-4 py-2 text-left text-xs text-gray-500">{t('end', 'End')}</th>
                                            <th className="px-4 py-2 text-left text-xs text-gray-500">{t('status', 'Status')}</th>
                                            <th className="px-4 py-2 text-left text-xs text-gray-500">{t('actions', 'Actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {editableSchedules.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                    <select value={row.dayOfWeek} onChange={(e) => onHandleChange(i, 'dayOfWeek', Number(e.target.value))} className="rounded border-gray-300 px-2 py-1">
                                                        {daysOfWeek.map((d, di) => (
                                                            <option key={di} value={di + 1}>{d}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input type="time" value={row.startTime?.slice(0, 5) || ''} onChange={(e) => onHandleChange(i, 'startTime', e.target.value)} className="rounded border-gray-300 px-2 py-1" />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input type="time" value={row.endTime?.slice(0, 5) || ''} onChange={(e) => onHandleChange(i, 'endTime', e.target.value)} className="rounded border-gray-300 px-2 py-1" />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <select value={row.status} onChange={(e) => onHandleChange(i, 'status', e.target.value)} className="rounded border-gray-300 px-2 py-1">
                                                        <option value="A">Active</option>
                                                        <option value="I">Inactive</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button onClick={() => onHandleDeleteRow(i)} className="px-3 py-1 bg-red-100 text-red-600 rounded">
                                                        
                                                        <span className="material-symbols-outlined "> delete </span>
                                                        </button>
                                                    
                                                </td>
                                            </tr>
                                        ))}
                                        {editableSchedules.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">{t('no-schedules', 'No schedules defined')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end gap-2">
                            <button onClick={() => { onHandleCancel(); onShowModal(false); }} className="px-4 py-2 bg-gray-200 rounded">{t('cancel', 'Cancel')}</button>
                            <button onClick={onHandleSave} className={`px-4 py-2 rounded text-white ${isEditing ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 text-gray-600'}`} disabled={!isEditing}>{t('save', 'Save')}</button>
                        </div>
                    </div>
                </div>
    )
}