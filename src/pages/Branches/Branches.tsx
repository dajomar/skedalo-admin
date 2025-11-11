import { useAuthStore } from "@/store/authStore";
import { useEmpresaStore } from "@/store/empresaStore";
import { useLocationStore } from "@/store/locationStore";
import { useSedeStore } from "@/store/useSedeStore";
import { showAlertError, showAlertInfo } from "@/utils/sweetalert2";
import { useTranslation } from "react-i18next";
import type { Branches } from '@/types';
import { useEffect, useMemo, useState } from "react";
import Pagination from "@/components/UI/Pagination";
import { FooterPagination } from "@/components/UI/FooterPagination";

const Branches = () => {


    const { t } = useTranslation();

    const { countries, states, cities, listCountries, listStates, listCities } = useLocationStore();
    const { sedes, listarSedes, guardarSede } = useSedeStore();
    const { companyId, companyName, setCompanyName } = useAuthStore();
    const { company } = useEmpresaStore();

    const sedeInicial: Branches = {
        branchId: null,
        branchName: "",
        address: "",
        phoneNumbers: "",
        status: "",
        companyId: companyId,
        cities: {
            cityId: "",
            cityName: "",
            dianCode: "",
            states: {
                statesPK: {
                    countryId: "",
                    stateId: ""
                },
                name: "",
                dianCode: "",
                displayOrder: 0
            }
        },
        timezone: "America/Bogota"
    };

    useMemo(() => {
        if (countries.length === 0)
            listCountries();  // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useMemo(() => {
        if (sedes.length === 0)
            listarSedes(companyId); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyId]);

    const [validated, setValidated] = useState(false);
    const [showSedesModal, setShowSedesModal] = useState(false);
    const [formData, setFormData] = useState<Branches>(sedeInicial);
    const [searchTerm, setSearchTerm] = useState("");
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);


    useEffect(() => {
        if (formData.cities.states?.statesPK.countryId !== "")
            listStates(formData.cities.states?.statesPK.countryId || "");
    }, [formData.cities.states?.statesPK.countryId, listStates]);

    useEffect(() => {
        setCompanyName(company.companyName || "");
    }, [company, setCompanyName]);

    useEffect(() => {
        if (
            formData.cities.states?.statesPK.countryId !== "" &&
            formData.cities.states?.statesPK.stateId !== ""
        )
            listCities({
                countryId: formData.cities.states?.statesPK.countryId || "",
                stateId: formData.cities.states?.statesPK.stateId || ""
            });
    }, [
        formData.cities.states?.statesPK.countryId,
        formData.cities.states?.statesPK.stateId,
        listCities
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "country") {
            setFormData(prev => ({
                ...prev,
                cities: {
                    cityId: "",
                    cityName: "",
                    dianCode: "",
                    states: {
                        statesPK: {
                            countryId: value,
                            stateId: ""
                        },
                        name: "",
                        dianCode: "",
                        displayOrder: 0
                    }
                }
            }));
            listStates(value);
        }

        else if (name === "state") {
            setFormData(prev => {
                const prevCiudad = prev.cities ?? {
                    cityId: "",
                    cityName: "",
                    dianCode: "",
                    states: {
                        statesPK: {
                            countryId: "",
                            stateId: ""
                        },
                        name: "",
                        dianCode: "",
                        displayOrder: 0
                    }
                };

                const prevDepartamentos = prevCiudad.states ?? {
                    statesPK: {
                        countryId: "",
                        stateId: ""
                    },
                    name: "",
                    dianCode: "",
                    displayOrder: 0
                };

                return {
                    ...prev,
                    cities: {
                        ...prevCiudad,
                        cityId: "",
                        states: {
                            ...prevDepartamentos,
                            statesPK: {
                                ...prevDepartamentos.statesPK,
                                stateId: value
                            }
                        }
                    }
                };
            });

            listCities({
                countryId: formData.cities?.states?.statesPK.countryId || "",
                stateId: value
            });
        }

        else if (name === "cities") {
            setFormData(prev => ({
                ...prev,
                cities: {
                    ...prev.cities,
                    cityId: value
                }
            }));
        }

        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            const respuesta = await guardarSede(formData);

            if (respuesta !== null) {
                if (respuesta.messageId == "TR000") {
                    setFormData({ ...formData, branchId: respuesta.dataNumber1 });
                    showAlertInfo(respuesta.messageText);
                    setShowSedesModal(false)
                    listarSedes(companyId);
                }
                else
                    showAlertError(respuesta.messageText);
            }
            else
                showAlertError(t("error-save"));

        }
        setValidated(true);
    };

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormData(sedeInicial);
        setValidated(false);
    };

    const handleSelectSede = (branch: Branches) => setFormData(branch);

    // Search & pagination
    const filteredSedes = useMemo(() => {
        return sedes.filter(s =>
            (s.branchName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.address || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sedes, searchTerm]);

    //const totalItems = filteredSedes.length;
    // const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = filteredSedes.slice(indexOfFirstItem, indexOfLastItem);

    // const handlePageChange = (page: number) => setCurrentPage(page);
    // const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setItemsPerPage(parseInt(e.target.value));
    //     setCurrentPage(1);
    // };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Open modal to add new branch
    const handleAddNew = () => {
        setFormData(sedeInicial);
        setShowSedesModal(true);
    };

    // Handle bottom sheet swipe down to close on mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd < -100) {
            // Swiped down more than 100px
            setShowSedesModal(false);
            setValidated(false);
        }
    };


  // Información necesaria por paginación 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(filteredSedes.length / itemsPerPage);
    const currentItems = filteredSedes.slice(
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
                            placeholder="Search branches..."
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200">
                            <span className="material-symbols-outlined text-base mr-2">filter_list</span>
                            Filters
                        </button>
                        <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                            <span className="material-symbols-outlined text-base mr-2">add</span>
                            Add New Branch
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {/* Desktop table view */}
                    <div className="hidden md:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('branch-name', 'Branch Name')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('address', 'Address')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('phone', 'Phone')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('city', 'City')}</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((b) => (
                                    <tr key={b.branchId ?? Math.random()} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">#{b.branchId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                                                    <span className="material-symbols-outlined text-primary text-xl">store</span>
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">{b.branchName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 max-w-xs truncate">{b.address}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <span className="flex items-center">
                                                <span className="material-symbols-outlined text-gray-400 text-base mr-1">phone</span>
                                                {b.phoneNumbers}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <span className="material-symbols-outlined text-xs mr-1">location_on</span>
                                                {b.cities.cityName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => { setFormData(b); setShowSedesModal(true); }} className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors" title={t('edit', 'Edit')}>
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
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
                                <span className="material-symbols-outlined text-5xl mb-2">store_off</span>
                                <p>{t('no-branches-found', 'No branches found')}</p>
                            </div>
                        )}
                        
                        {currentItems.map((b) => (
                            <div key={b.branchId ?? Math.random()} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center flex-1">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                                            <span className="material-symbols-outlined text-primary text-2xl">store</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">{b.branchName}</h3>
                                            <p className="text-xs text-gray-400">#{b.branchId}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">{t('address', 'Address')}</p>
                                        <p className="text-sm text-gray-900">{b.address}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">{t('phone', 'Phone')}</p>
                                            <p className="text-sm font-medium text-gray-900 flex items-center">
                                                <span className="material-symbols-outlined text-gray-400 text-base mr-1">phone</span>
                                                {b.phoneNumbers}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">{t('city', 'City')}</p>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <span className="material-symbols-outlined text-xs mr-1">location_on</span>
                                                {b.cities.cityName}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t">
                                    <button onClick={() => { setFormData(b); setShowSedesModal(true); }} className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-primary/10 text-primary rounded-md text-sm font-medium hover:bg-primary/20 transition-colors">
                                        <span className="material-symbols-outlined text-base mr-1">edit</span>
                                        {t('edit', 'Edit')}
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
                    totalItems={sedes.length}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />

            </div>

            {/* Modal: form for add/edit branch */}
            {showSedesModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
                        onClick={() => setShowSedesModal(false)} 
                    />
                    
                    {/* Modal Container - Bottom Sheet on mobile, centered modal on desktop */}
                    <div 
                        className="relative w-full sm:max-w-3xl h-[85vh] sm:max-h-[90vh] bg-white rounded-t-3xl sm:rounded-xl shadow-2xl flex flex-col animate-slide-up sm:animate-none overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Drag indicator for mobile */}
                        <div className="flex justify-center pt-3 pb-2 sm:hidden flex-shrink-0">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                        </div>
                        
                        {/* Header - Fixed */}
                        <div className="flex items-center justify-between px-4 py-3 sm:p-6 border-b border-gray-200 flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl">store</span>
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                        {formData.branchId ? t('edit', 'Edit') + ' ' + t('branch', 'Branch') : t('add', 'Add') + ' ' + t('branch', 'Branch')}
                                    </h3>
                                    <p className="text-sm text-gray-500">{formData.branchId ? `ID: #${formData.branchId}` : t('create-new-branch', 'Create a new branch')}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSedesModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Form Content - Scrollable */}
                        <form noValidate onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                                                    {t('branch-name', 'Branch Name')} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="branchName"
                                                    value={formData.branchName}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder={t('enter-branch-name', 'Enter branch name')}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                                        validated && !formData.branchName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                    }`}
                                                />
                                                {validated && !formData.branchName && (
                                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                                        <span className="material-symbols-outlined text-sm mr-1">error</span>
                                                        {t('field-required', 'This field is required')}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    {t('address', 'Address')}
                                                </label>
                                                <input
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    placeholder={t('enter-address', 'Enter full address')}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    {t('phone', 'Phone Number')}
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">phone</span>
                                                    <input
                                                        name="phoneNumbers"
                                                        value={formData.phoneNumbers}
                                                        onChange={handleInputChange}
                                                        placeholder="+1 234 567 8900"
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    {t('status', 'Status')}
                                                </label>
                                                <select
                                                    name="status"
                                                    value={formData.status || ''}
                                                    onChange={handleSelectChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                >
                                                    <option value="">-- {t('select-status', 'Select Status')} --</option>
                                                    <option value="A">✓ {t('active', 'Active')}</option>
                                                    <option value="I">✕ {t('inactive', 'Inactive')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Section */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                                            <span className="material-symbols-outlined text-primary text-lg mr-2">location_on</span>
                                            {t('location', 'Location')}
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    {t('country', 'Country')}
                                                </label>
                                                <select
                                                    name="country"
                                                    value={formData.cities?.states?.statesPK.countryId || ''}
                                                    onChange={handleSelectChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                >
                                                    <option value="">-- {t('select-country', 'Select Country')} --</option>
                                                    {countries.map(c => (
                                                        <option key={c.countryId} value={c.countryId}>{c.countryName}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    {t('state', 'State/Province')}
                                                </label>
                                                <select
                                                    name="state"
                                                    value={formData.cities?.states?.statesPK.stateId || ''}
                                                    onChange={handleSelectChange}
                                                    disabled={!formData.cities?.states?.statesPK.countryId}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                                                >
                                                    <option value="">-- {t('select-state', 'Select State')} --</option>
                                                    {states.map(s => (
                                                        <option key={s.statesPK.stateId} value={s.statesPK.stateId}>{s.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    {t('city', 'City')}
                                                </label>
                                                <select
                                                    name="cities"
                                                    value={formData.cities?.cityId || ''}
                                                    onChange={handleSelectChange}
                                                    disabled={!formData.cities?.states?.statesPK.stateId}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                                                >
                                                    <option value="">-- {t('select-city', 'Select City')} --</option>
                                                    {cities.map(c => (
                                                        <option key={c.cityId} value={c.cityId}>{c.cityName}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    {t('timezone', 'Timezone')}
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">schedule</span>
                                                    <input
                                                        name="timezone"
                                                        value={formData.timezone}
                                                        onChange={handleInputChange}
                                                        placeholder="America/Bogota"
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer - Fixed */}
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSedesModal(false);
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
                                    className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
                                >
                                    <span className="flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg mr-2">
                                            {formData.branchId ? 'save' : 'add'}
                                        </span>
                                        {formData.branchId ? t('save-changes', 'Save Changes') : t('create-branch', 'Create Branch')}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}

export default Branches;