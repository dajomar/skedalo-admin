import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useServicesStore } from "@/store/servicesStore";
import { useServiceCategoriesStore } from "@/store/serviceCategoriesStore";
import type { Services } from "@/types";
import { showAlertError, showAlertInfo } from "@/utils/sweetalert2";

interface AddServiceProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: Services | null;
}

export default function AddService({ isOpen, onClose, initialService }: AddServiceProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">{form.serviceId ? "Edit Service" : "Add New Service"}</h3>
        </div>
        <form className="p-6" noValidate onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service name</label>
              <input
                name="serviceName"
                value={form.serviceName}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary ${validated && !form.serviceName ? 'border-red-500' : ''}`}
                placeholder="Service name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value={0}>Uncategorized</option>
                {serviceCategories.map((cat, idx) => (
                  <option key={cat.categoryId ?? idx} value={cat.categoryId ?? 0}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <div className="mt-1 flex">
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.price}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary ${validated && form.price < 0 ? 'border-red-500' : ''}`}
                />
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="ml-2 rounded-md border-gray-300"
                >
                  <option value={defaultCurrency}>{defaultCurrency}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                name="durationMinutes"
                type="number"
                min={1}
                value={form.durationMinutes}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="A">Available</option>
                <option value="L">Limited</option>
                <option value="U">Unavailable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Icon (URL)</label>
              <input
                name="icon"
                value={form.icon || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                placeholder="Icon URL"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{form.serviceId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
