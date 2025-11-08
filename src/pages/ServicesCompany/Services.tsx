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
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                                    scope="col">
                                    <input className="rounded border-gray-300 text-primary focus:ring-primary"
                                        type="checkbox" />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    scope="col">
                                    Service Name
                                    <button className="ml-1 text-gray-400 hover:text-gray-600"><span
                                        className="material-symbols-outlined text-sm">arrow_upward</span></button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    scope="col">
                                    Category
                                    <button className="ml-1 text-gray-400 hover:text-gray-600"><span
                                        className="material-symbols-outlined text-sm">arrow_upward</span></button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    scope="col">
                                    Price
                                    <button className="ml-1 text-gray-400 hover:text-gray-600"><span
                                        className="material-symbols-outlined text-sm">arrow_upward</span></button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    scope="col">
                                    Duration
                                    <button className="ml-1 text-gray-400 hover:text-gray-600"><span
                                        className="material-symbols-outlined text-sm">arrow_upward</span></button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    scope="col">
                                    Availability
                                    <button className="ml-1 text-gray-400 hover:text-gray-600"><span
                                        className="material-symbols-outlined text-sm">arrow_upward</span></button>
                                </th>
                                <th className="relative px-6 py-3" scope="col">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>


                        <tbody className="bg-white divide-y divide-gray-200">

                            <>
                            
                            
                                {currentItems.map((serv) => (
                                    
                                    <tr key={serv.serviceId} className="hover:bg-gray-50" >
                                        
                                        <td className="px-6 py-4 whitespace-nowrap w-12">
                                            <input className="rounded border-gray-300 text-primary focus:ring-primary"
                                                type="checkbox" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-900">
                                            {serv.serviceName}
                                        </td>   
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {serviceCategories.find(cat => cat.categoryId === serv.categoryId)?.name || 'Uncategorized'} 
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {serv.currency} ${(serv.price.toFixed(2).toString())}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {serv.durationMinutes} min
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {serv.status === 'A' ? 'Available' : serv.status === 'L' ? 'Limited' : 'Unavailable'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-primary hover:text-primary/70 mr-2" onClick={() => handleSelectService(serv)}><span
                                                className="material-symbols-outlined text-base">edit</span></button>
                                            <button className="text-red-600 hover:text-red-900"><span       
                                            className="material-symbols-outlined text-base">delete</span></button>
                                        </td>
                                    </tr>
                                    
                                    
                                    
                                ))} 
                            </>
                            
                        </tbody>
                    </table>
                </div>
               
               <FooterPagination
                                   currentPage={currentPage}
                                   totalPages={totalPages}
                                   itemsPerPage={itemsPerPage}
                                   totalItems={services.length}
                                   onPageChange={setCurrentPage}
                                   onItemsPerPageChange={setItemsPerPage}
                               />

                <div className="mt-6 flex justify-end space-x-3">
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
        
        {showModal && (
            <AddService isOpen={showModal} onClose={() => setShowModal(false)} initialService={formData} />
        )}

    </>
}

export default ServicesCompany;
