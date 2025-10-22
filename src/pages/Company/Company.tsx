import { currencies } from "@/data/currency";
import { useAuthStore } from "@/store/authStore";
import { useBusinessCategoriesStore } from "@/store/businessCategoriesStore";
import { useEmpresaStore } from "@/store/empresaStore";
import { useLocationStore } from "@/store/locationStore";
import type { Companies } from "@/types";
import { showAlertError, showAlertInfo } from "@/utils/sweetalert2";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const Company = () => {

    const { t } = useTranslation();
    const [showEmailSettingsModal, setShowEmailSettingsModal] = useState(false);
    const [validated, setValidated] = useState(false);

    const { countries, states, cities, listCountries, listStates, listCities } = useLocationStore();
    const { companyId, userId } = useAuthStore();
    const { company, findCompany, saveCompany, setRespuestaNull } = useEmpresaStore();
    const { businessCategories, listBusinessCategories } = useBusinessCategoriesStore();

    const [showLogoModal, setShowLogoModal] = useState(false);


    // ✅ Estado inicial del formulario
    const [formData, setFormData] = useState({
        companyCode: "",
        companyName: "",
        address: "",
        country: "",
        state: "",
        cities: "",
        contactName: "",
        contactPhone: "",
        websiteUrl: "",
        defaultCurrency: "USD",
        status: "A",
        businessCategoryId: "",
        logoUrl: "",
        profileImageUrl: "",
        description: ""
    });

    // ✅ Cargar datos iniciales al montar la página
    useEffect(() => {
        listCountries();
        listBusinessCategories();

        if (companyId) {
            (async () => {
                const data = await findCompany(companyId);
                if (data) {
                    setFormData({
                        companyCode: data.companyCode || "",
                        companyName: data.companyName || "",
                        address: data.address || "",
                        country: data.cities?.states?.statesPK.countryId || "",
                        state: data.cities?.states?.statesPK.stateId || "",
                        cities: data.cities?.cityId || "",
                        contactName: data.contactName || "",
                        contactPhone: data.contactPhone || "",
                        websiteUrl: data.websiteUrl || "",
                        defaultCurrency: data.defaultCurrency || "USD",
                        status: data.status || "A",
                        businessCategoryId: String(data.businessCategoryId || ""),
                        logoUrl: data.logoUrl || "",
                        profileImageUrl: data.profileImageUrl || "",
                        description: data.description || ""
                    });
                }
            })();
        }
    }, [companyId, findCompany, listCountries, listBusinessCategories]);

    // ✅ Cuando cambia el país, cargar estados
    useEffect(() => {
        if (formData.country) {
            listStates(formData.country);
        }
    }, [formData.country, listStates]);

    // ✅ Cuando cambia el estado, cargar ciudades
    useEffect(() => {
        if (formData.country && formData.state) {
            listCities({ countryId: formData.country, stateId: formData.state });
        }
    }, [formData.country, formData.state, listCities]);

    // ✅ Formatear datos antes de guardar
    const formatEmpresa = (): Companies => {
        const localDateTime = new Date();
        return {
            companyId: companyId,
            companyCode: formData.companyCode,
            companyName: formData.companyName,
            address: formData.address,
            contactName: formData.contactName,
            contactPhone: formData.contactPhone,
            status: formData.status,
            websiteUrl: formData.websiteUrl || null,
            defaultCurrency: formData.defaultCurrency,
            cities: {
                cityId: formData.cities,
                cityName: "",
                dianCode: "",
                states: {
                    statesPK: {
                        countryId: formData.country,
                        stateId: formData.state
                    },
                    name: "",
                    dianCode: "",
                    displayOrder: 0
                }
            },
            businessCategoryId: Number(formData.businessCategoryId),
            updatedAt: localDateTime,
            updatedBy: userId,
            description: formData.description || null,
            logoUrl: formData.logoUrl || null,
            profileImageUrl: formData.profileImageUrl || null,
            icon: null
        };
    };

    // ✅ Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, businessCategoryId: e.target.value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            const companyData = formatEmpresa();
            const resp = await saveCompany(companyData);

            if (resp && resp.messageId === "TR000") {
                showAlertInfo(resp.messageText);
            } else if (resp) {
                 showAlertError(resp.messageText);
            } else {
                 showAlertError(t("error-save-company"));
            }

            setRespuestaNull();
        }
        setValidated(true);
    };

    const handleLogoUpdated = (newLogoUrl: string) => {
        setFormData(prev => ({ ...prev, logoUrl: newLogoUrl }));
    };


    return (
        <>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">{t("Company")}</h3>
                        <form onSubmit={handleSubmit} method="POST">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="companyCode">
                                        {t("code")}
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="companyCode" name="companyCode"
                                        value={formData.companyCode}
                                        onChange={handleInputChange} />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="business-name">
                                        {t("name")}
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="business-name" placeholder="e.g., The Beauty Lounge"
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="business-description">{t("description")}
                                    </label>
                                    <textarea cols={30} rows={10}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="business-description"
                                        placeholder="e.g., The Beauty Lounge"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    >
                                    </textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="address">{t("address")}</label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="address" name="address" placeholder="123 Main St" type="text"
                                        value={formData.address}
                                        onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="country">{t("country")}</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleSelectChange}>
                                        <option value="">{t("select-country")}</option>
                                        {countries.map(country => (
                                            <option value={country.countryId} key={country.countryId}>
                                                {country.countryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="state">
                                        {t("state")}
                                    </label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleSelectChange}
                                    >
                                        <option value="">{t("select-state")}</option>
                                        {states.map(depto => (
                                            <option value={depto.statesPK.stateId} key={depto.statesPK.stateId}>
                                                {depto.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="city">{t("city")}</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="country"
                                        name="cities"
                                        value={formData.cities}
                                        onChange={handleSelectChange}
                                    >
                                        <option value="">{t("select-city")}</option>
                                        {cities.map(city => (
                                            <option value={city.cityId} key={city.cityId}>
                                                {city.cityName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="zip">
                                        ZIP / Postal Code (pendiente)
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="zip" name="zip" placeholder="12345" type="text" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="contact-name">
                                        {t("contact-name")}
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="contact-name" placeholder="..." type="text"
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleInputChange} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
                                        {t("contact-phone")}
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="phone" placeholder="(555) 123-4567" type="tel"
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                                        Contact
                                        Email (pendiente)
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="email" name="email" placeholder="contact@yourbusiness.com" type="email" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="websiteUrl">{t("websiteUrl")}
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="websiteUrl" type="text"
                                        name="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={handleInputChange}
                                        placeholder={t("websiteUrl-placeholder")}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="businessCategoryId">{t("category")} </label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="businessCategoryId"
                                        name="businessCategoryId"
                                        value={formData.businessCategoryId}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value="">{t("select-category")}</option>
                                        {businessCategories.map(cat => (
                                            <option value={cat.businessCategoryId} key={cat.businessCategoryId}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="defaultCurrency">{t("default-currency")} </label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="defaultCurrency"
                                        name="defaultCurrency"
                                        value={formData.defaultCurrency}
                                        onChange={handleInputChange}
                                    >
                                        {currencies.map(cur => (
                                            <option value={cur.code} key={cur.code}>
                                                {cur.code} - {cur.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="status">{t("status")}</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleSelectChange}
                                    >
                                        <option value="A">{t("status-A")}</option>
                                        <option value="I">{t("status-I")}</option>
                                    </select>
                                </div>

                                {/* horas

                                <div className="md:col-span-2 pt-6">
                                    <h4 className="text-xl font-bold text-gray-800 mb-4">Business Hours</h4>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Monday</label></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="monday-open" type="time" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="monday-close" type="time" /></div>
                                            <div className="col-span-1 flex items-center"><input
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                id="monday-closed" name="monday-closed" type="checkbox" /><label
                                                    className="ml-2 block text-sm text-gray-900"
                                                    htmlFor="monday-closed">Closed</label></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Tuesday</label>
                                            </div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="tuesday-open" type="time" value="09:00" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="tuesday-close" type="time" value="17:00" /></div>
                                            <div className="col-span-1"></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Wednesday</label>
                                            </div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="wednesday-open" type="time" value="09:00" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="wednesday-close" type="time" value="17:00" /></div>
                                            <div className="col-span-1"></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Thursday</label>
                                            </div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="thursday-open" type="time" value="09:00" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="thursday-close" type="time" value="17:00" /></div>
                                            <div className="col-span-1"></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Friday</label></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="friday-open" type="time" value="09:00" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="friday-close" type="time" value="17:00" /></div>
                                            <div className="col-span-1"></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Saturday</label>
                                            </div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="saturday-open" type="time" value="10:00" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="saturday-close" type="time" value="15:00" /></div>
                                            <div className="col-span-1"></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Sunday</label></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="sunday-open" type="time" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="sunday-close" type="time" /></div>
                                            <div className="col-span-1 flex items-center"><input
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                id="sunday-closed" name="sunday-closed" type="checkbox" /><label
                                                    className="ml-2 block text-sm text-gray-900"
                                                    htmlFor="sunday-closed">Closed</label></div>
                                        </div>
                                    </div>
                                </div> */}
                                {/* Horas  */}



                                <div className="md:col-span-2 pt-6">
                                    <h4 className="text-xl font-bold text-gray-800 mb-4">Services Offered</h4>
                                    <textarea
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        id="services" name="services"
                                        placeholder="List your services, e.g., Haircut, Manicure, Facial..."
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2 pt-6">
                                    <h4 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700"
                                            htmlFor="payment-method">Accepted Payment Methods</label>
                                        <div className="mt-2 flex flex-wrap gap-4">
                                            <div className="flex items-center"><input
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                id="credit-card" name="payment-method" type="checkbox" /><label
                                                    className="ml-2 block text-sm text-gray-900" htmlFor="credit-card">Credit
                                                    Card</label></div>
                                            <div className="flex items-center"><input
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                id="paypal" name="payment-method" type="checkbox" /><label
                                                    className="ml-2 block text-sm text-gray-900" htmlFor="paypal">PayPal</label>
                                            </div>
                                            <div className="flex items-center"><input
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                id="cash" name="payment-method" type="checkbox" /><label
                                                    className="ml-2 block text-sm text-gray-900" htmlFor="cash">Cash</label>
                                            </div>
                                            <div className="flex items-center"><input
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                id="other" name="payment-method" type="checkbox" /><label
                                                    className="ml-2 block text-sm text-gray-900" htmlFor="other">Other</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-5 border-t border-gray-200">
                                <div className="flex justify-end">
                                    <button
                                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        type="button">Cancel</button>
                                    <button
                                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        type="submit">{t("save")}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>

    )
}

export default Company;