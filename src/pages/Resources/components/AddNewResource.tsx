import type { Branches, Resources } from "@/types";
import BottomSheetModal from "@/components/UI/BottomSheetModal";
import { useTranslation } from "react-i18next";

interface AddNewResourceProps {
    isOpen: boolean;
    onClose: () => void;
    formData: Resources;
    previewPhotoUrl: string;
    sedes: Branches[];
    validated: boolean;
    onHandleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onHandleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onHandlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


export const AddNewResource = ({
    isOpen,
    onClose,
    formData,
    previewPhotoUrl,
    sedes,
    validated,
    onHandleSubmit,
    onHandleInputChange,
    onHandlePhotoChange,
}: AddNewResourceProps) => {

    const { t } = useTranslation();

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

    
    const icon = formData.resourceType === 'P' ? 'person' : formData.resourceType === 'L' ? 'location_on' : 'inventory_2';

    return (
        <BottomSheetModal
            isOpen={isOpen}
            onClose={() => {
                onClose();
            }}
            title={formData.resourceId ? t('edit-resource', 'Edit Resource') : t('add-resource', 'Add New Resource')}
            subtitle={formData.resourceId ? `ID: #${formData.resourceId}` : t('create-new-resource', 'Create a new resource')}
            icon={icon}
            maxWidth="3xl"
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
                        type="submit"
                        form="resource-form"
                        className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                        <span className="flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg mr-2">{formData.resourceId ? 'save' : 'add'}</span>
                            {formData.resourceId ? t('save-changes', 'Save Changes') : t('create', 'Create')}
                        </span>
                    </button>
                </div>
            }
        >
            <form id="resource-form" className="" noValidate onSubmit={(form) => onHandleSubmit(form)}>
                <div className="space-y-6">
                    {/* Basic */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="material-symbols-outlined text-primary text-lg mr-2">info</span>
                            {t('basic-information', 'Basic Information')}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('resource-name', 'Resource name')} <span className="text-red-500">*</span></label>
                                <input name="resourceName" value={formData.resourceName} onChange={onHandleInputChange} required placeholder={t('enter-resource-name','Enter resource name')} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${validated && !formData.resourceName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('branch','Branch')}</label>
                                <select name="branchId" value={formData.branchId} onChange={onHandleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                                    <option value={0}>-- {t('select-branch','Select branch')} --</option>
                                    {sedes.map(s => <option key={s.branchId ?? 0} value={s.branchId ?? 0}>{s.branchName}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('type','Type')}</label>
                                <select name="resourceType" value={formData.resourceType} onChange={onHandleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                                    <option value="P">{t('person','Person')}</option>
                                    <option value="L">{t('location','Location')}</option>
                                    <option value="O">{t('other','Other')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('capacity','Max capacity')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">groups</span>
                                    <input name="maxCapacity" type="number" value={formData.maxCapacity} onChange={onHandleInputChange} placeholder="0" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="material-symbols-outlined text-primary text-lg mr-2">contact_phone</span>
                            {t('contact', 'Contact')}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('phone','Phone')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">phone</span>
                                    <input name="phoneNumber" value={formData.phoneNumber} onChange={onHandleInputChange} placeholder="+57 300 000 0000" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email','Email')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">alternate_email</span>
                                    <input name="email" value={formData.email} onChange={onHandleInputChange} placeholder="name@company.com" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description & Photo */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="material-symbols-outlined text-primary text-lg mr-2">description</span>
                            {t('details', 'Details')}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('description','Description')}</label>
                                <textarea name="description" value={formData.description} onChange={onHandleInputChange} rows={3} placeholder={t('enter-description','Enter description')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('photo','Photo')}</label>
                                <input id="photo-input" type="file" accept="image/*" onChange={(photo)=>{onHandlePhotoChange(photo)}} className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                                {previewPhotoUrl && <img src={previewPhotoUrl} alt="preview" className="mt-2 w-24 h-24 object-cover rounded-md border" />}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('status','Status')}</label>
                                <select name="status" value={formData.status} onChange={onHandleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                                    <option value="A">✓ {t('active','Active')}</option>
                                    <option value="I">✕ {t('inactive','Inactive')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </BottomSheetModal>
    );
}