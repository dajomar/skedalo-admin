import { useAuthStore } from "@/store/authStore";
import { useServiceCategoriesStore } from "@/store/serviceCategoriesStore";
import type { ServiceCategories } from "@/types";
import { showAlertError, showAlertInfo } from "@/utils/sweetalert2";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/UI/Pagination";
import AddCategory from "@/components/UI/AddCategory";


export const ServiceCategoriesPage = () => {
  const { t } = useTranslation();
  const { companyId, userId } = useAuthStore();
  const { serviceCategories, listCategoryServiceByCompany, saveCategoryService } = useServiceCategoriesStore();

  const initialCategory: ServiceCategories = {
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

  const [formData, setFormData] = useState<ServiceCategories>(initialCategory);
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useMemo(() => {
    if (serviceCategories.length === 0) listCategoryServiceByCompany(companyId);
    // eslint-disable-next-line
  }, [companyId]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, companyId }));
  }, [companyId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCategory = (cat: ServiceCategories) => {
    setFormData(cat);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      const formDataToSave: ServiceCategories = {
        ...formData,
        updatedBy: userId,
        updatedAt: new Date()
      };

      const resp = await saveCategoryService(formDataToSave);

      if (resp && resp.messageId === "TR000") {
        showAlertInfo(resp.messageText);
        setShowModal(false);
        setFormData(initialCategory);
        setValidated(false);
        // if server-side ordering/paging needed we could re-fetch here
        // listCategoryServiceByCompany(companyId);
      } else if (resp) {
        showAlertError(resp.messageText);
      } else {
        showAlertError(t("error-save-category"));
      }
    }
    setValidated(true);
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData(initialCategory);
    setValidated(false);
  };

  // (pagination computed from filtered list below)

  const filtered = useMemo(() => {
    return serviceCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [serviceCategories, searchTerm]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const changePage = (page: number) => setCurrentPage(page);

  const openAddModal = () => { setFormData(initialCategory); setShowModal(true); };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchTerm(e.target.value); setCurrentPage(1); };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const newItems = parseInt(e.target.value); setItemsPerPage(newItems); setCurrentPage(1); };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-1/2 md:w-1/3">
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Search categories..."
              type="text"
              value={searchTerm}
              onChange={handleSearch} />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200">
              <span className="material-symbols-outlined text-base mr-2">filter_list</span>
              Filters
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              <span className="material-symbols-outlined text-base mr-2">add</span>
              {t('new-category', 'New Category')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12" scope="col">
                  <input className="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">{t('name', 'Name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">{t('description', 'Description')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">{t('status', 'Status')}</th>
                <th className="relative px-6 py-3" scope="col"><span className="sr-only">Edit</span></th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.map((cat) => (
                <tr key={cat.categoryId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap w-12">
                    <input className="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary/70 mr-2" onClick={() => handleSelectCategory(cat)}><span className="material-symbols-outlined text-base">edit</span></button>
                    <button className="text-red-600 hover:text-red-900"><span className="material-symbols-outlined text-base">delete</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <label className="mr-2" htmlFor="rows_per_page">Rows per page:</label>
              <select
                className="border border-gray-300 rounded-md py-1 px-2 focus:ring-primary focus:border-primary"
                id="rows_per_page"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
        <AddCategory isOpen={showModal} onClose={() => setShowModal(false)} initialCategory={formData} />
    </div>
    </div>
  );
};

export default ServiceCategoriesPage;