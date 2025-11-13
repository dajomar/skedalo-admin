import { editUser, find } from "@/services/UserServices";
import { useAuthStore } from "@/store/authStore";
import { useLocationStore } from "@/store/locationStore";
import type { UsersDTO, Response } from "@/types";
import { showAlertError, showAlertInfo } from "@/utils/sweetalert2";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";


export const UserProfile = () => {
    const { t } = useTranslation();
    const { userId } = useAuthStore();
    const { countries, states, cities, listCountries, listStates, listCities } = useLocationStore();
    const [formData, setFormData] = useState<UsersDTO | null>(null);
    const [validated, setValidated] = useState(false);
    const initialDataRef = useRef<UsersDTO | null>(null);

    // Load user info and countries on mount
    useEffect(() => {
        async function fetchData() {
            await listCountries();
            if (userId) {
                const user: UsersDTO = await find(userId);
                setFormData(user);
                initialDataRef.current = user;
                // Load states and cities for user's country/state
                if (user?.countryId) await listStates(user.countryId);
                if (user?.countryId && user?.stateId) await listCities({ countryId: user.countryId, stateId: user.stateId });
            }
        }
        fetchData();
    }, [userId, listCountries, listStates, listCities]);


    // Handle input change (text, email, etc)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => prev ? { ...prev, [name]: value } : prev);
    };

    // Handle select change (for selects not dependent)
    /*const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => prev ? { ...prev, [name]: value } : prev);
    };*/

    // Handle country change
    const handleCountryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const countryId = e.target.value;
        setFormData((prev) => prev ? { ...prev, countryId, stateId: "", cityId: "" } : prev);
        await listStates(countryId);
    };

    // Handle state change
    const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const stateId = e.target.value;
        setFormData((prev) => prev ? { ...prev, stateId, cityId: "" } : prev);
        if (formData?.countryId) await listCities({ countryId: formData.countryId, stateId });
    };

    // Handle city change
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = e.target.value;
        setFormData((prev) => prev ? { ...prev, cityId } : prev);
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidated(true);
        if (formData) {
            const resp: Response = await editUser(formData);
            if (resp && resp.messageId === "TR000") {
                showAlertInfo(resp.messageText);
                //setFormData(initialService);
            } else if (resp) {
                showAlertError(resp.messageText);
            } else {
                showAlertError(t("error-edit-user"));
            }
            // TODO: show feedback (success/error)
        }
    };

    if (!formData) return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                <span className="text-gray-600">{t("loading")}</span>
            </div>
        </div>
    );



    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl">account_circle</span>
                        {t('user-profile', 'User Profile')}
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">
                        {t('manage-profile-info', 'Manage your personal information and preferences')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Personal Information Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-4 sm:px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person</span>
                                {t('personal-info', 'Personal Information')}
                            </h2>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="firstName">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">badge</span>
                                            {t('first-name', 'First Name')} <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t('enter-first-name', 'Enter your first name')}
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900 ${
                                            validated && !formData.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                    {validated && !formData.firstName && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">error</span>
                                            {t('field-required', 'This field is required')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="lastName">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">badge</span>
                                            {t('last-name', 'Last Name')} <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t('enter-last-name', 'Enter your last name')}
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900 ${
                                            validated && !formData.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                    {validated && !formData.lastName && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">error</span>
                                            {t('field-required', 'This field is required')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">email</span>
                                            {t('email', 'Email')} <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t('enter-email', 'your@email.com')}
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900 ${
                                            validated && !formData.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                    {validated && !formData.email && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">error</span>
                                            {t('field-required', 'This field is required')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="phoneNumber">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">call</span>
                                            {t('phone', 'Phone')}
                                        </span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleInputChange}
                                        placeholder={t('enter-phone', '(555) 123-4567')}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-4 sm:px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                {t('location', 'Location')}
                            </h2>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="countryId">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">public</span>
                                            {t('country', 'Country')} <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <select
                                        id="countryId"
                                        name="countryId"
                                        value={formData.countryId}
                                        onChange={handleCountryChange}
                                        required
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900 ${
                                            validated && !formData.countryId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">{t('select-country', 'Select country')}</option>
                                        {countries.map(country => (
                                            <option key={country.countryId} value={country.countryId}>
                                                {country.countryName}
                                            </option>
                                        ))}
                                    </select>
                                    {validated && !formData.countryId && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">error</span>
                                            {t('field-required', 'This field is required')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="stateId">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">map</span>
                                            {t('state', 'State')} <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <select
                                        id="stateId"
                                        name="stateId"
                                        value={formData.stateId}
                                        onChange={handleStateChange}
                                        required
                                        disabled={!formData.countryId}
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                                            validated && !formData.stateId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">{t('select-state', 'Select state')}</option>
                                        {states.map(state => (
                                            <option key={state.statesPK.stateId} value={state.statesPK.stateId}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                    {validated && !formData.stateId && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">error</span>
                                            {t('field-required', 'This field is required')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="cityId">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-gray-400 text-lg">location_city</span>
                                            {t('city', 'City')} <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <select
                                        id="cityId"
                                        name="cityId"
                                        value={formData.cityId}
                                        onChange={handleCityChange}
                                        required
                                        disabled={!formData.stateId}
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                                            validated && !formData.cityId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">{t('select-city', 'Select city')}</option>
                                        {cities.map(city => (
                                            <option key={city.cityId} value={city.cityId}>
                                                {city.cityName}
                                            </option>
                                        ))}
                                    </select>
                                    {validated && !formData.cityId && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">error</span>
                                            {t('field-required', 'This field is required')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 sm:mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="address">
                                    <span className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-gray-400 text-lg">home</span>
                                        {t('address', 'Address')}
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                    placeholder={t('enter-address', '123 Main Street')}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6">
                        <button
                            type="button"
                            onClick={() => setFormData(initialDataRef.current)}
                            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">close</span>
                                {t('cancel', 'Cancel')}
                            </span>
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">save</span>
                                {t('save-changes', 'Save Changes')}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserProfile;