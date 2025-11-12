import { currencies } from "@/data/currency";
import { useAuthStore } from "@/store/authStore";
import { useBusinessCategoriesStore } from "@/store/businessCategoriesStore";
import { useEmpresaStore } from "@/store/empresaStore";
import { useLocationStore } from "@/store/locationStore";
import type { Companies } from "@/types";
import { showAlertError, showAlertInfo } from "@/utils/sweetalert2";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BusinessHours } from "./components/BusinessHours";
import LogoUploadModal from "@/components/UI/LogoUploadModal";


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

    const getCompanyCodeName = () => {
        if (company) {
            return company.companyName.replaceAll(" ", "-").toLowerCase(); 
        }
        return "";
    }

    // Handle logo update callback
    const handleLogoUpdate = (newLogoUrl: string) => {
        // TODO: Implement backend upload logic here
        console.log('Updating logo with URL:', newLogoUrl);
        setFormData(prev => ({ ...prev, logoUrl: newLogoUrl }));
        showAlertInfo(t('logo-updated', 'Logo updated successfully'));
    };

    return (
        <>
            <div className="w-full">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl">business</span>
                            {t("Company")}
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            {t("manage-company-info", "Manage your company information and settings")}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-4 sm:px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    {t("basic-information", "Basic Information")}
                                </h2>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="companyCode">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">tag</span>
                                            {t("code")}
                                        </span>
                                    </label>
                                    <input
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
                                        id="companyCode" name="companyCode"
                                        value={formData.companyCode}
                                        onChange={handleInputChange} 
                                        placeholder={t("enter-code", "Enter code")}
                                    />
                                </div>


                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="business-name">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">store</span>
                                            {t("name")} <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
                                        id="business-name" placeholder={t("enter-name", "e.g., The Beauty Lounge")}
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="business-description">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">description</span>
                                            {t("description")}
                                        </span>
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900 resize-none"
                                        id="business-description"
                                        placeholder={t("enter-description", "Describe your business")}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="businessCategoryId">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">category</span>
                                            {t("category")}
                                        </span>
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="defaultCurrency">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">payments</span>
                                            {t("default-currency")}
                                        </span>
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="status">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">toggle_on</span>
                                            {t("status")}
                                        </span>
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleSelectChange}
                                    >
                                        <option value="A">✓ {t("status-A")}</option>
                                        <option value="I">✕ {t("status-I")}</option>
                                    </select>
                                </div>

                                {/* Company Logo Card */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">image</span>
                                            {t("company-logo", "Company Logo")}
                                        </span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowLogoModal(true)}
                                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                                    >
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            {/* Logo Preview */}
                                            <div className="flex-shrink-0">
                                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200 group-hover:border-primary/50 transition-colors">
                                                    {formData.logoUrl ? (
                                                        <img 
                                                            src={formData.logoUrl} 
                                                            alt="Company Logo" 
                                                            className="w-full h-full object-contain p-2"
                                                        />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-gray-300 text-4xl group-hover:text-primary/50 transition-colors">
                                                            add_photo_alternate
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Info Text */}
                                            <div className="flex-1 text-center sm:text-left">
                                                <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                                                    {formData.logoUrl ? t("change-logo", "Change Company Logo") : t("upload-logo", "Upload Company Logo")}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {t("click-to-upload", "Click to upload or change your logo")}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                                                    <span className="material-symbols-outlined text-xs">info</span>
                                                    {t("logo-format", "PNG or JPG, max 2MB")}
                                                </p>
                                            </div>

                                            {/* Arrow Icon */}
                                            <div className="hidden sm:block flex-shrink-0">
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">
                                                    arrow_forward
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-4 sm:px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                {t("location", "Location")}
                            </h2>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="address">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">home</span>
                                            {t("address")}
                                        </span>
                                    </label>
                                    <input
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
                                        id="address" name="address" placeholder="123 Main St" type="text"
                                        value={formData.address}
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="country">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">public</span>
                                            {t("country")}
                                        </span>
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="state">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">map</span>
                                            {t("state")}
                                        </span>
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleSelectChange}
                                        disabled={!formData.country}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="city">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">location_city</span>
                                            {t("city")}
                                        </span>
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
                                        id="country"
                                        name="cities"
                                        value={formData.cities}
                                        onChange={handleSelectChange}
                                        disabled={!formData.state}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="zip">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">mail</span>
                                            {t("zip-code", "ZIP / Postal Code")} <span className="text-xs text-gray-400">({t("pending", "pending")})</span>
                                        </span>
                                    </label>
                                    <input
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900 bg-gray-50"
                                        id="zip" name="zip" placeholder="12345" type="text" disabled 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-4 sm:px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">contact_phone</span>
                                {t("contact-information", "Contact Information")}
                            </h2>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-name">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">person</span>
                                            {t("contact-name")}
                                        </span>
                                    </label>
                                    <input
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
                                        id="contact-name" placeholder={t("enter-name", "Enter contact name")} type="text"
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="phone">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">call</span>
                                            {t("contact-phone")}
                                        </span>
                                    </label>
                                    <input
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
                                        id="phone" placeholder="(555) 123-4567" type="tel"
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">email</span>
                                            {t("contact-email", "Contact Email")} <span className="text-xs text-gray-400">({t("pending", "pending")})</span>
                                        </span>
                                    </label>
                                    <input
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900 bg-gray-50"
                                        id="email" name="email" placeholder="contact@yourbusiness.com" type="email" disabled 
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="websiteUrl">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">language</span>
                                            {t("websiteUrl")}
                                        </span>
                                    </label>
                                    <input
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
                                        id="websiteUrl" type="text"
                                        name="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={handleInputChange}
                                        placeholder={t("websiteUrl-placeholder")}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">link</span>
                                            {t("public-page", "Public Page")}
                                        </span>
                                    </label>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-lg">open_in_new</span>
                                        <a 
                                            href={`https://site.skedalo.com/${getCompanyCodeName()}`} 
                                            className="text-primary hover:underline text-sm flex-1 truncate font-medium" 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {`site.skedalo.com/${getCompanyCodeName()}`}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-4 sm:px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">credit_card</span>
                                {t("payment-information", "Payment Information")}
                            </h2>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    {t("accepted-payment-methods", "Accepted Payment Methods")}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <input
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            id="credit-card" name="payment-method" type="checkbox" 
                                        />
                                        <label className="ml-3 flex items-center gap-2 text-sm text-gray-900 cursor-pointer" htmlFor="credit-card">
                                            <span className="material-symbols-outlined text-gray-400">credit_card</span>
                                            {t("credit-card", "Credit Card")}
                                        </label>
                                    </div>
                                    <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <input
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            id="paypal" name="payment-method" type="checkbox" 
                                        />
                                        <label className="ml-3 flex items-center gap-2 text-sm text-gray-900 cursor-pointer" htmlFor="paypal">
                                            <span className="material-symbols-outlined text-gray-400">account_balance_wallet</span>
                                            PayPal
                                        </label>
                                    </div>
                                    <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <input
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            id="cash" name="payment-method" type="checkbox" 
                                        />
                                        <label className="ml-3 flex items-center gap-2 text-sm text-gray-900 cursor-pointer" htmlFor="cash">
                                            <span className="material-symbols-outlined text-gray-400">payments</span>
                                            {t("cash", "Cash")}
                                        </label>
                                    </div>
                                    <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <input
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            id="other" name="payment-method" type="checkbox" 
                                        />
                                        <label className="ml-3 flex items-center gap-2 text-sm text-gray-900 cursor-pointer" htmlFor="other">
                                            <span className="material-symbols-outlined text-gray-400">more_horiz</span>
                                            {t("other", "Other")}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6">
                        <button
                            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                            type="button"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">close</span>
                                {t("cancel", "Cancel")}
                            </span>
                        </button>
                        <button
                            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
                            type="submit"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">save</span>
                                {t("save")}
                            </span>
                        </button>
                    </div>
                    </form>
                </div>
            </div>

            {/* Logo Upload Modal */}
            <LogoUploadModal
                isOpen={showLogoModal}
                onClose={() => setShowLogoModal(false)}
                currentLogoUrl={formData.logoUrl || null}
                onLogoUpdate={handleLogoUpdate}
            />
        </>

    )
}

export default Company;