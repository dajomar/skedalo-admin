import { useAuthStore } from "@/store/authStore";
import { useServiceCategoriesStore } from "@/store/serviceCategoriesStore";
import type { ServiceCategories } from "@/types";
import { showAlertError, showAlertInfo } from "@/utils/sweetalert2";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/UI/Pagination";
import AddCategory from "@/components/UI/AddCategory";
import { FooterPagination } from "@/components/UI/FooterPagination";


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

  const changePage = (page: number) => setCurrentPage(page);

  const openAddModal = () => { setFormData(initialCategory); setShowModal(true); };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchTerm(e.target.value); setCurrentPage(1); };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const newItems = parseInt(e.target.value); setItemsPerPage(newItems); setCurrentPage(1); };

  
    // Información necesaria por paginación 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentItems = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
  
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
          {/* Desktop table view */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">{t('name', 'Name')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">{t('description', 'Description')}</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">{t('color', 'Color')}</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">{t('status', 'Status')}</th>
                  <th className="relative px-6 py-3" scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((cat) => (
                  <tr key={cat.categoryId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* {cat.icon && (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: cat.color ? `${cat.color}20` : '#f3f4f6' }}>
                            <span className="material-symbols-outlined text-xl" style={{ color: cat.color || '#6b7280' }}>{cat.icon}</span>
                          </div>
                        )} */}
                        <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs truncate">{cat.description}</div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      {cat.color && (
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded border border-gray-300 mr-2" style={{ backgroundColor: cat.color }}></div>
                          <span className="text-xs text-gray-600 font-mono">{cat.color}</span>
                        </div>
                      )}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cat.status === 'A' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cat.status === 'A' ? t('active', 'Active') : t('inactive', 'Inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1">
                        <button onClick={() => handleSelectCategory(cat)} className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors" title={t('edit', 'Edit')}>
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title={t('delete', 'Delete')}>
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-4">
            {currentItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <span className="material-symbols-outlined text-5xl mb-2">category_off</span>
                <p>{t('no-categories-found', 'No categories found')}</p>
              </div>
            )}
            
            {currentItems.map((cat) => (
              <div key={cat.categoryId} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center flex-1">
                    {/* {cat.icon && (
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: cat.color ? `${cat.color}20` : '#f3f4f6' }}>
                        <span className="material-symbols-outlined text-2xl" style={{ color: cat.color || '#6b7280' }}>{cat.icon}</span>
                      </div>
                    )} */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{cat.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{cat.description}</p>
                    </div>
                  </div>
                  <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    cat.status === 'A' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {cat.status === 'A' ? t('active', 'Active') : t('inactive', 'Inactive')}
                  </span>
                </div>

                {/* {cat.color && (
                  <div className="mb-3 pb-3 border-b">
                    <p className="text-xs text-gray-500 mb-1">{t('color', 'Color')}</p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded border border-gray-300 mr-2" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-xs text-gray-600 font-mono">{cat.color}</span>
                    </div>
                  </div>
                )} */}

                <div className="flex items-center gap-2 pt-3 border-t">
                  <button onClick={() => handleSelectCategory(cat)} className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-primary/10 text-primary rounded-md text-sm font-medium hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-base mr-1">edit</span>
                    {t('edit', 'Edit')}
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

    
          <FooterPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            totalItems={serviceCategories.length}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />

        <AddCategory isOpen={showModal} onClose={() => setShowModal(false)} initialCategory={formData} />
    </div>
    </div>
  );
};

export default ServiceCategoriesPage;