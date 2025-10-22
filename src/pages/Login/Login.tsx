import LanguageSwitcher from "@/components/UI/LanguageSwitcher";
import { getURLApiServer } from "@/helpers/helpers";
import { useAuthStore } from "@/store/authStore";
import type { UserLogin } from "@/types";
import { showAlertError } from "@/utils/sweetalert2";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";


 const Login = () => {
    const { t, i18n } = useTranslation();
    const { login, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });

    useMemo(() => {
        setFormData({ email: "", password: "" });
    }, []);

    useEffect(() => {
        //setFormData({ email: "gabo@gmail.com", password: "1234567" }); // quitar esta línea
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            showAlertError(t("login-missing-credentials"));
            return;
        }
        const resp: UserLogin = await login(formData.email, formData.password);
        if (resp?.accessToken === null) {
            showAlertError(t("login-error-invalid-credentials"));
        }
    };

    // 🔹 Cambiar idioma
    const handleChangeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };


    return (
        <>
            <div className="bg-gray-100 flex items-center justify-center h-screen">


                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                    <div className="flex justify-end mb-4">
                        <div className="relative inline-block text-left">
                        <LanguageSwitcher />
                            {/* <select
                                className="block w-full pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md appearance-none bg-white"
                                id="language-select" name="language">
                                <option value="en" onClick={() => handleChangeLanguage("en")} >English</option>
                                <option value="es" onClick={() => handleChangeLanguage("es")}>Español</option>
                                <option value="fr"onClick={() => handleChangeLanguage("fr")}>Français</option>
                                
                            </select>
                            <span
                                className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">language</span> */}
                        </div>
                    </div>
                    <div className="flex flex-col items-center mb-6">
                        <span className="material-symbols-outlined text-primary text-5xl mb-3">raven</span>
                        <h1 className="text-3xl font-bold text-gray-800">Skedalo</h1>
                        <p className="text-gray-500 text-center mt-2">Access your business dashboard securely.</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">{t("login-email-label")}</label>
                            <div className="relative">
                                <span
                                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
                                <input
                                    className="pl-10 pr-4 py-3 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50 text-gray-800"
                                    name="email" type="email"
                                    id="emailInput"
                                    placeholder={t("login-email-placeholder")}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }

                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">{t("login-password-label")}</label>
                            <div className="relative">
                                <span
                                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                                <input
                                    className="pl-10 pr-4 py-3 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50 text-gray-800"
                                    name="password" type="password"
                                    id="passwordInput"
                                    placeholder={t("login-password-placeholder")}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }

                                />
                            </div>
                        </div>
                        {/* <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="region">Region/Country</label>
                        <div className="relative">
                            <span
                                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">public</span>
                            <select
                                className="pl-10 pr-4 py-3 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50 text-gray-800 appearance-none"
                                id="region" name="region">
                                <option value="">Select your region/country</option>
                                <option value="us">United States</option>
                                <option value="gb">United Kingdom</option>
                                <option value="ca">Canada</option>
                                <option value="au">Australia</option>
                                <option value="de">Germany</option>
                                <option value="fr">France</option>
                                <option value="jp">Japan</option>
                            </select>
                            <span
                                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">arrow_drop_down</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">This may affect data residency and applicable security protocols.
                        </p>
                    </div> */}
                        <button
                            className="w-full bg-primary text-white py-3 rounded-md font-semibold text-lg hover:bg-primary/90 transition duration-300 ease-in-out flex items-center justify-center"
                            type="submit">
                            <span className="material-symbols-outlined mr-2">login</span>
                            {t("login-button-submit")}
                        </button>
                        <div className="mt-6 text-center text-gray-600 text-sm">
                            <p className="mb-2 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-500 mr-2 text-xl">security</span>
                                Your data is encrypted and secure.
                            </p>
                            <a className="text-primary hover:underline font-medium" href="#">{t("login-forgotpassword")}</a>
                            <p className="mb-2 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-500 mr-2 text-xl"></span>
                                Versión v1.0.0
                            </p>
                        </div>
                    </form>
                </div>

            </div>

        </>

    )


}
export default Login;

