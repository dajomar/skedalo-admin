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
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((b) => (
                                <tr key={b.branchId ?? Math.random()} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.branchId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-900">{b.branchName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.phoneNumbers}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.cities.cityName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => { setFormData(b); setShowSedesModal(true); }} className="text-primary hover:text-primary/70 mr-2">
                                            <span className="material-symbols-outlined text-base">edit</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowSedesModal(false)} />
                    <div className="relative w-full max-w-3xl mx-4 bg-white rounded-lg shadow-lg">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold">{formData.branchId ? t('branch') + ' - Edit' : t('branch') + ' - Add'}</h3>
                        </div>
                        <form className="p-6" noValidate onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Branch name</label>
                                    <input name="branchName" value={formData.branchName} onChange={handleInputChange} required className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary ${validated && !formData.branchName ? 'border-red-500' : ''}`} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone numbers</label>
                                    <input name="phoneNumbers" value={formData.phoneNumbers} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <input name="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    <select name="country" value={formData.cities?.states?.statesPK.countryId || ''} onChange={handleSelectChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary">
                                        <option value="">-- Select country --</option>
                                        {countries.map(c => <option key={c.countryId} value={c.countryId}>{c.countryName}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">State</label>
                                    <select name="state" value={formData.cities?.states?.statesPK.stateId || ''} onChange={handleSelectChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary">
                                        <option value="">-- Select state --</option>
                                        {states.map(s => <option key={s.statesPK.stateId} value={s.statesPK.stateId}>{s.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <select name="cities" value={formData.cities?.cityId || ''} onChange={handleSelectChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary">
                                        <option value="">-- Select city --</option>
                                        {cities.map(c => <option key={c.cityId} value={c.cityId}>{c.cityName}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select name="status" value={formData.status || ''} onChange={handleSelectChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary">
                                        <option value="">-- Select Status --</option>
                                        <option value="A">Active</option>
                                        <option value="I">Inactive</option>

                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                                    <input name="timezone" value={formData.timezone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary" />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => { setShowSedesModal(false); }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}

export default Branches;