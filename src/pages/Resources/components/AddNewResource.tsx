import type { Branches, Resources } from "@/types";
import { useState } from "react";

interface AddNewResourceProps {
    onShowModal: (isVisible:boolean) => void;
    formData: Resources;
    previewPhotoUrl:string;
    sedes: Branches[];
    validated:boolean;
    onHandleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onHandleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onHandlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

}


export const AddNewResource = ({
    onShowModal,
    formData,
    previewPhotoUrl,
    sedes,
    validated,
    onHandleSubmit,
    onHandleInputChange,
    onHandlePhotoChange
}: AddNewResourceProps) => {

     const initialResource: Resources = {
        resourceId: null,
        //branchId: sedes.length > 0 ? sedes[0].branchId || 0 : 0,
        branchId: 0,
        resourceName: "",
        description: "",
        resourceType: "P",
        maxCapacity: 0,
        email: "",
        phoneNumber: "",
        status: "A",
        photoUrl: "",
        updatedAt: new Date(),
        updatedBy: 0,
    };

    
    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => onShowModal(false)} />
            <div className="relative w-full max-w-3xl mx-4 bg-white rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">{formData.resourceId ? 'Edit Resource' : 'Add New Resource'}</h3>
                </div>
                <form className="p-6" noValidate onSubmit={(form) => onHandleSubmit(form)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Resource name</label>
                            <input name="resourceName" value={formData.resourceName} onChange={onHandleInputChange} required className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary ${validated && !formData.resourceName ? 'border-red-500' : ''}`} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Branch</label>
                            <select name="branchId" value={formData.branchId} onChange={onHandleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary">
                                <option value={0}>-- Select branch --</option>
                                {sedes.map(s => <option key={s.branchId ?? 0} value={s.branchId ?? 0}>{s.branchName}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select name="resourceType" value={formData.resourceType} onChange={onHandleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary">
                                <option value="P">Person</option>
                                <option value="L">Location</option>
                                <option value="O">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Max capacity</label>
                            <input name="maxCapacity" type="number" value={formData.maxCapacity} onChange={onHandleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={onHandleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input name="phoneNumber" value={formData.phoneNumber} onChange={onHandleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input name="email" value={formData.email} onChange={onHandleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Photo</label>
                            <input type="file" accept="image/*" onChange={(photo)=>{onHandlePhotoChange(photo)}} className="mt-1 block w-full" />
                            {previewPhotoUrl && <img src={previewPhotoUrl} alt="preview" className="mt-2 w-24 h-24 object-cover rounded-md" />}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" value={formData.status} onChange={onHandleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary">
                                <option value="A">Active</option>
                                <option value="I">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={() => { onShowModal(false); }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save</button>
                    </div>
                </form>
            </div>
        </div>


    )
}