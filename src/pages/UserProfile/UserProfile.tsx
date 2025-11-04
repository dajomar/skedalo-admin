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

    if (!formData) return <div className="container mt-4"><div className="p-4 bg-white rounded shadow-sm border">{t("loading")}</div></div>;



    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('user-profile', 'Perfil de Usuario')}</h2>
                    
                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                        {/* Información Personal */}
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">{t('personal-info', 'Información Personal')}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                                        {t('first-name', 'Nombre')}
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                                        {t('last-name', 'Apellido')}
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                        {t('email', 'Correo Electrónico')}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber">
                                        {t('phone', 'Teléfono')}
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ubicación */}
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">{t('location', 'Ubicación')}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="countryId">
                                        {t('country', 'País')}
                                    </label>
                                    <select
                                        id="countryId"
                                        name="countryId"
                                        value={formData.countryId}
                                        onChange={handleCountryChange}
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    >
                                        <option value="">{t('select-country', 'Seleccionar país')}</option>
                                        {countries.map(country => (
                                            <option key={country.countryId} value={country.countryId}>
                                                {country.countryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="stateId">
                                        {t('state', 'Estado/Departamento')}
                                    </label>
                                    <select
                                        id="stateId"
                                        name="stateId"
                                        value={formData.stateId}
                                        onChange={handleStateChange}
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    >
                                        <option value="">{t('select-state', 'Seleccionar estado')}</option>
                                        {states.map(state => (
                                            <option key={state.statesPK.stateId} value={state.statesPK.stateId}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cityId">
                                        {t('city', 'Ciudad')}
                                    </label>
                                    <select
                                        id="cityId"
                                        name="cityId"
                                        value={formData.cityId}
                                        onChange={handleCityChange}
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    >
                                        <option value="">{t('select-city', 'Seleccionar ciudad')}</option>
                                        {cities.map(city => (
                                            <option key={city.cityId} value={city.cityId}>
                                                {city.cityName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                                    {t('address', 'Dirección')}
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setFormData(initialDataRef.current)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {t('cancel', 'Cancelar')}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {t('save-changes', 'Guardar Cambios')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;