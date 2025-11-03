import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useServiceCategoriesStore } from "@/store/serviceCategoriesStore";
import type { ServiceCategories } from "@/types";
import { showAlertError, showAlertInfo } from "@/utils/sweetalert2";

interface AddCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: ServiceCategories | null;
}

export default function AddCategory({ isOpen, onClose, initialCategory }: AddCategoryProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">{form.categoryId ? "Edit Category" : "Add New Category"}</h3>
        </div>
        <form className="p-6" noValidate onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary ${validated && !form.name ? 'border-red-500' : ''}`}
                placeholder="Category name"
              />
            </div>

            <div>
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
                value={form.status || 'A'}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="A">Active</option>
                <option value="I">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{form.categoryId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
