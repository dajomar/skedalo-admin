import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useServiceCategoriesStore } from "@/store/serviceCategoriesStore";
import type { ServiceCategories } from "@/types";
import { showAlertError, showAlertInfo } from "@/utils/sweetalert2";
import BottomSheetModal from "./BottomSheetModal";
import { useTranslation } from "react-i18next";

interface AddCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: ServiceCategories | null;
}

export default function AddCategory({ isOpen, onClose, initialCategory }: AddCategoryProps) {
  const { t } = useTranslation();
  const { companyId, userId } = useAuthStore();
  const { saveCategoryService, listCategoryServiceByCompany } = useServiceCategoriesStore();

  const blankCategory: ServiceCategories = {
    categoryId: null,
    companyId: companyId,
    name: "",
    description: "",
    icon: "",
    color: "",
    status: "A",
    updatedAt: new Date(),
    updatedBy: 0,
  };

  const [form, setForm] = useState<ServiceCategories>(initialCategory || blankCategory);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setForm(initialCategory || { ...blankCategory, companyId });
    setValidated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    if (formEl.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const payload: ServiceCategories = {
      ...form,
      companyId: companyId,
      updatedAt: new Date(),
      updatedBy: userId,
    };

    try {
      const resp = await saveCategoryService(payload);
      if (resp && resp.messageId === "TR000") {
        showAlertInfo(resp.messageText);
        if (companyId) await listCategoryServiceByCompany(companyId);
        onClose();
      } else if (resp) {
        showAlertError(resp.messageText);
      } else {
        showAlertError("Error saving category");
      }
    } catch (err) {
      showAlertError("Error saving category");
    }
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setValidated(false);
      }}
      title={form.categoryId ? t('edit-category', 'Edit Category') : t('add-category', 'Add New Category')}
      subtitle={form.categoryId ? `ID: #${form.categoryId}` : t('create-new-category', 'Create a new category')}
      icon={ 'category'}
      maxWidth="md"
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6">
          <button
            type="button"
            onClick={() => {
              onClose();
              setValidated(false);
            }}
            className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <span className="flex items-center justify-center">
              <span className="material-symbols-outlined text-lg mr-2">close</span>
              {t('cancel', 'Cancel')}
            </span>
          </button>
          <button
            type="submit"
            form="category-form"
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            <span className="flex items-center justify-center">
              <span className="material-symbols-outlined text-lg mr-2">{form.categoryId ? 'save' : 'add'}</span>
              {form.categoryId ? t('update', 'Update') : t('create', 'Create')}
            </span>
          </button>
        </div>
      }
    >
      <form id="category-form" noValidate onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <span className="material-symbols-outlined text-primary text-lg mr-2">info</span>
              {t('basic-information', 'Basic Information')}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('name', 'Name')} <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder={t('enter-category-name', 'Enter category name')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                    validated && !form.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {validated && !form.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="material-symbols-outlined text-sm mr-1">error</span>
                    {t('field-required', 'This field is required')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('description', 'Description')}
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t('enter-description', 'Enter description')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('status', 'Status')}
                </label>
                <select
                  name="status"
                  value={form.status || 'A'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="A">✓ {t('active', 'Active')}</option>
                  <option value="I">✕ {t('inactive', 'Inactive')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appearance */}
          {/* <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <span className="material-symbols-outlined text-primary text-lg mr-2">palette</span>
              {t('appearance', 'Appearance')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('color', 'Color')} <span className="text-xs text-gray-500">(#HEX)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    name="color"
                    value={form.color || ''}
                    onChange={handleChange}
                    placeholder="#3b82f6"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-mono"
                  />
                  <div className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center" style={{ backgroundColor: form.color || '#ffffff' }}>
                    {!form.color && <span className="material-symbols-outlined text-gray-300">colorize</span>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('icon', 'Icon')} <span className="text-xs text-gray-500">({t('material-symbols', 'Material Symbols')})</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    name="icon"
                    value={form.icon || ''}
                    onChange={handleChange}
                    placeholder="category"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: form.color ? `${form.color}20` : 'rgba(59,130,246,0.1)' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl" style={{ color: form.color || '#3b82f6' }}>{form.icon || 'category'}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {t('icon-hint', 'Browse icons at')} <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">fonts.google.com/icons</a>
                </p>
              </div>
            </div>
          </div> */}

          
        </div>
      </form>
    </BottomSheetModal>
  );
}
