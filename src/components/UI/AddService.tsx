import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useServicesStore } from "@/store/servicesStore";
import { useServiceCategoriesStore } from "@/store/serviceCategoriesStore";
import type { Services } from "@/types";
import { showAlertError, showAlertInfo } from "@/utils/sweetalert2";
import BottomSheetModal from "./BottomSheetModal";
import { useTranslation } from "react-i18next";

interface AddServiceProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: Services | null;
}

export default function AddService({ isOpen, onClose, initialService }: AddServiceProps) {
  const { t } = useTranslation();
  const { companyId, userId, defaultCurrency } = useAuthStore();
  const { saveService, listServicesByCompany } = useServicesStore();
  const { serviceCategories, listCategoryServiceByCompany } = useServiceCategoriesStore();

  const blankService: Services = {
    serviceId: null,
    companyId: companyId,
    categoryId: 0,
    serviceName: "",
    description: "",
    durationMinutes: 30,
    price: 0,
    currency: defaultCurrency,
    icon: "",
    status: "A",
    updatedAt: new Date(),
    updatedBy: 0,
  };

  const [form, setForm] = useState<Services>(initialService || blankService);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    // ensure categories are loaded
    if (serviceCategories.length === 0 && companyId) {
      listCategoryServiceByCompany(companyId);
    }
    // when opening with an initialService, set local form
  }, [serviceCategories.length, companyId, listCategoryServiceByCompany]);

  useEffect(() => {
    setForm(initialService || { ...blankService, companyId });
    setValidated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialService, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Some controls (select) return string even for numeric ids - parse known numeric fields
    if (name === "categoryId" || name === "durationMinutes" || name === "price") {
      const parsed = Number(value);
      setForm(prev => ({ ...prev, [name]: isNaN(parsed) ? (value as any) : parsed }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    if (formEl.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const formDataToSave: Services = {
      ...form,
      companyId: companyId,
      updatedAt: new Date(),
      updatedBy: userId,
    };

    try {
      const resp = await saveService(formDataToSave);
      if (resp && resp.messageId === "TR000") {
        showAlertInfo(resp.messageText);
        // refresh list
        if (companyId) await listServicesByCompany(companyId);
        onClose();
      } else if (resp) {
        showAlertError(resp.messageText);
      } else {
        showAlertError("Error saving service");
      }
    } catch (err) {
      showAlertError("Error saving service");
    }
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setValidated(false);
      }}
      title={form.serviceId ? t('edit-service', 'Edit Service') : t('add-service', 'Add New Service')}
      subtitle={form.serviceId ? `ID: #${form.serviceId}` : t('create-new-service', 'Create a new service')}
      icon={form.icon || 'room_service'}
      maxWidth="2xl"
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
            form="service-form"
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            <span className="flex items-center justify-center">
              <span className="material-symbols-outlined text-lg mr-2">
                {form.serviceId ? 'save' : 'add'}
              </span>
              {form.serviceId ? t('update', 'Update') : t('create', 'Create')}
            </span>
          </button>
        </div>
      }
    >
      <form id="service-form" noValidate onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <span className="material-symbols-outlined text-primary text-lg mr-2">info</span>
              {t('basic-information', 'Basic Information')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('service-name', 'Service Name')} <span className="text-red-500">*</span>
                </label>
                <input
                  name="serviceName"
                  value={form.serviceName}
                  onChange={handleChange}
                  required
                  placeholder={t('enter-service-name', 'Enter service name')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                    validated && !form.serviceName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {validated && !form.serviceName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="material-symbols-outlined text-sm mr-1">error</span>
                    {t('field-required', 'This field is required')}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('description', 'Description')}
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t('enter-description', 'Enter service description')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('category', 'Category')}
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value={0}>{t('uncategorized', 'Uncategorized')}</option>
                  {serviceCategories.map((cat, idx) => (
                    <option key={cat.categoryId ?? idx} value={cat.categoryId ?? 0}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('status', 'Status')}
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="A">✓ {t('available', 'Available')}</option>
                  <option value="L">⚠ {t('limited', 'Limited')}</option>
                  <option value="U">✕ {t('unavailable', 'Unavailable')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Duration Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <span className="material-symbols-outlined text-primary text-lg mr-2">payments</span>
              {t('pricing-duration', 'Pricing & Duration')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('price', 'Price')} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">$</span>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min={0}
                      value={form.price}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        validated && form.price < 0 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value={defaultCurrency}>{defaultCurrency}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('duration', 'Duration (minutes)')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">schedule</span>
                  <input
                    name="durationMinutes"
                    type="number"
                    min={1}
                    value={form.durationMinutes}
                    onChange={handleChange}
                    placeholder="30"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <span className="material-symbols-outlined text-primary text-lg mr-2">palette</span>
              {t('appearance', 'Appearance')}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('icon', 'Icon')} <span className="text-xs text-gray-500">({t('material-symbols', 'Material Symbols')})</span>
                </label>
                <div className="flex gap-3">
                  <input
                    name="icon"
                    value={form.icon || ''}
                    onChange={handleChange}
                    placeholder="room_service"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  {form.icon && (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-2xl">{form.icon}</span>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {t('icon-hint', 'Browse icons at')} <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">fonts.google.com/icons</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </BottomSheetModal>
  );
}
