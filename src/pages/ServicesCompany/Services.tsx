import { useAuthStore } from "@/store/authStore";
import { useServiceCategoriesStore } from "@/store/serviceCategoriesStore";
import { useServicesStore } from "@/store/servicesStore";
import type { Services } from "@/types";
import { showAlertError, showAlertInfo } from "@/utils/sweetalert2";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/UI/Pagination";
import AddService from "@/components/UI/AddService";
import { FooterPagination } from "@/components/UI/FooterPagination";

const ServicesCompany = () => {

    const { companyId, userId, defaultCurrency } = useAuthStore();
    const { t } = useTranslation();
    const { services, listServicesByCompany, saveService } = useServicesStore();
    const { serviceCategories, listCategoryServiceByCompany } = useServiceCategoriesStore();

    const initialService: Services = {
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

    const [formData, setFormData] = useState<Services>(initialService);
    const [validated, setValidated] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState("");

    useMemo(() => {
        if (services.length === 0) listServicesByCompany(companyId);
        if (serviceCategories.length === 0) listCategoryServiceByCompany(companyId);
        // eslint-disable-next-line
    }, [companyId]);

    useEffect(() => {
        setFormData((prev) => ({ ...prev, companyId }));
        
    }, [companyId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    };

    const handleSelectService = (serv: Services) => {
        setFormData(serv);
        setShowModal(true);

    }
        

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            const formDataToSave: Services = {
                ...formData,
                updatedBy: userId,
                updatedAt: new Date()
            };
            const resp = await saveService(formDataToSave);
            if (resp && resp.messageId === "TR000") {
                setFormData({ ...formDataToSave, serviceId: resp.dataNumber1 });
                showAlertInfo(resp.messageText);
                //setFormData(initialService);
            } else if (resp) {
                showAlertError(resp.messageText);
            } else {
                showAlertError(t("error-save-service"));
            }
        }
        setValidated(true);
    };

    const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormData(initialService);
        setValidated(false);
    };

    // Filter services based on search term
    const filteredServices = useMemo(() => {
        return services.filter(service =>
            service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (serviceCategories.find(cat => cat.categoryId === service.categoryId)?.name || '')
                .toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [services, serviceCategories, searchTerm]);

    // Calculate pagination
    // const totalItems = filteredServices.length;
    // const totalPages = Math.ceil(totalItems / itemsPerPage);
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

    // const handlePageChange = (pageNumber: number) => {
    //     setCurrentPage(pageNumber);
    // };

    // const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const newItemsPerPage = parseInt(e.target.value);
    //     setItemsPerPage(newItemsPerPage);
    //     setCurrentPage(1); // Reset to first page when changing items per page
    // };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

      // Información necesaria por paginación 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const currentItems = filteredServices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return <>
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="relative w-full sm:w-1/2 md:w-1/3">
                        <input
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            placeholder="Search services..."
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch} />
                        <span
                            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200">
                            <span className="material-symbols-outlined text-base mr-2">filter_list</span>
                            Filters
                        </button>
                        <button
                            onClick={() => { setFormData(initialService); setShowModal(true); }}
                            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                            <span className="material-symbols-outlined text-base mr-2">add</span>
                            {t('new-service', 'New Service')}
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {/* Desktop table view */}
                    <div className="hidden md:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        scope="col">
                                        {t('service-name', 'Service Name')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        scope="col">
                                        {t('category', 'Category')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        scope="col">
                                        {t('price', 'Price')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        scope="col">
                                        {t('duration', 'Duration')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        scope="col">
                                        {t('status', 'Status')}
                                    </th>
                                    <th className="relative px-6 py-3" scope="col">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((serv) => (
                                    <tr key={serv.serviceId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {serv.icon && (
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                                                        <span className="material-symbols-outlined text-primary text-xl">{serv.icon}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{serv.serviceName}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-xs">{serv.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {serviceCategories.find(cat => cat.categoryId === serv.categoryId)?.name || t('uncategorized', 'Uncategorized')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {serv.currency} ${serv.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <span className="flex items-center">
                                                <span className="material-symbols-outlined text-gray-400 text-base mr-1">schedule</span>
                                                {serv.durationMinutes} {t('min', 'min')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                serv.status === 'A' ? 'bg-green-100 text-green-800' : 
                                                serv.status === 'L' ? 'bg-yellow-100 text-yellow-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {serv.status === 'A' ? t('available', 'Available') : serv.status === 'L' ? t('limited', 'Limited') : t('unavailable', 'Unavailable')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button onClick={() => handleSelectService(serv)} className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors" title={t('edit', 'Edit')}>
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
                                <span className="material-symbols-outlined text-5xl mb-2">search_off</span>
                                <p>{t('no-services-found', 'No services found')}</p>
                            </div>
                        )}
                        
                        {currentItems.map((serv) => (
                            <div key={serv.serviceId} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center flex-1">
                                        {serv.icon && (
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                                                <span className="material-symbols-outlined text-primary text-2xl">{serv.icon}</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">{serv.serviceName}</h3>
                                            <p className="text-xs text-gray-500 truncate">{serv.description}</p>
                                        </div>
                                    </div>
                                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                        serv.status === 'A' ? 'bg-green-100 text-green-800' : 
                                        serv.status === 'L' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {serv.status === 'A' ? t('available', 'Available') : serv.status === 'L' ? t('limited', 'Limited') : t('unavailable', 'Unavailable')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">{t('category', 'Category')}</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {serviceCategories.find(cat => cat.categoryId === serv.categoryId)?.name || t('uncategorized', 'Uncategorized')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">{t('price', 'Price')}</p>
                                        <p className="text-sm font-semibold text-gray-900">{serv.currency} ${serv.price.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">{t('duration', 'Duration')}</p>
                                        <p className="text-sm font-medium text-gray-900 flex items-center">
                                            <span className="material-symbols-outlined text-gray-400 text-base mr-1">schedule</span>
                                            {serv.durationMinutes} {t('min', 'min')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t">
                                    <button onClick={() => handleSelectService(serv)} className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-primary/10 text-primary rounded-md text-sm font-medium hover:bg-primary/20 transition-colors">
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
                                   totalItems={services.length}
                                   onPageChange={setCurrentPage}
                                   onItemsPerPageChange={setItemsPerPage}
                               />
            </div>
        </div>
        
        {showModal && (
            <AddService isOpen={showModal} onClose={() => setShowModal(false)} initialService={formData} />
        )}

    </>
}

export default ServicesCompany;
