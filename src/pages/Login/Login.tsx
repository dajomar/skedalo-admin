import LanguageSwitcher from "@/components/UI/LanguageSwitcher";
import { getURLApiServer } from "@/helpers/helpers";
import { useAuthStore } from "@/store/authStore";
import type { UserLogin } from "@/types";
import { showAlertError } from "@/utils/sweetalert2";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";


 const Login = () => {
    const { t, i18n } = useTranslation();
    const { login, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

     const [formData, setFormData] = useState({ email: "", password: "" });
     const [showPassword, setShowPassword] = useState(false);
     const [rememberMe, setRememberMe] = useState(false);
     const passwordRef = useRef<HTMLInputElement | null>(null);

    useMemo(() => {
        setFormData({ email: "", password: "" });
    }, []);

    useEffect(() => {
        //setFormData({ email: "gabo@gmail.com", password: "1234567" }); // quitar esta línea
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated, navigate]);

    // Load remembered email on mount
    useEffect(() => {
        const remembered = localStorage.getItem('rememberMe') === 'true';
        const rememberedEmail = localStorage.getItem('rememberMeEmail') || '';
        if (remembered && rememberedEmail) {
            setRememberMe(true);
            setFormData(prev => ({ ...prev, email: rememberedEmail }));
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            showAlertError(t("login-missing-credentials"));
            return;
        }
        const resp: UserLogin = await login(formData.email, formData.password);
        if (resp?.accessToken === null) {
            showAlertError(t("login-error-invalid-credentials"));
        } else {
            // Persist remember me preference (only email, never password)
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('rememberMeEmail', formData.email);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('rememberMeEmail');
            }
        }
    };

    //  Cambiar idioma
    const handleChangeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };


    return (
        <>
            <div className="min-h-[100dvh] bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    {/* Brand / Illustration panel (desktop only) */}
                    <div className="hidden lg:flex flex-col items-center justify-center p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-primary text-6xl transform transition-all duration-500 ease-out hover:scale-105 hover:rotate-[3deg]">raven</span>
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">Skedalo</h1>
                        </div>
                        <p className="text-gray-600 text-lg text-center max-w-md">
                            {t('login-tagline','Sign in to manage services, resources and schedules — all in one place.')}
                        </p>
                    </div>

                    {/* Login card */}
                    <div className="relative w-full">

                        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl w-full max-w-md mx-auto overflow-hidden relative">
                            {/* Language switcher (mobile - absolute) */}
                            <div className="absolute top-4 right-4 z-10 lg:hidden">
                                <LanguageSwitcher />
                            </div>
                            
                            {/* Card header (mobile) */}
                            <div className="px-6 pt-6 pb-4 text-center lg:hidden">
                                <span className="material-symbols-outlined text-primary text-5xl mb-1 inline-block transition-all duration-500 ease-out">raven</span>
                                <h2 className="text-2xl font-bold text-gray-800">Skedalo</h2>
                                <p className="text-gray-500 text-xs mt-1">{t('login-mobile-tagline','Manage your business efficiently.')}</p>
                            </div>
                            
                            {/* Language switcher (desktop inside card) */}
                            <div className="hidden lg:flex justify-end px-6 pt-6"><LanguageSwitcher /></div>

                            <div className="p-6 sm:p-8">
                                
                                <form onSubmit={handleLogin} noValidate>
                                    
                                    <div className="space-y-5">
                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                                                {t("login-email-label")}
                                            </label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
                                                <input
                                                    className="pl-10 pr-3 py-2.5 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 text-gray-900 placeholder-gray-400 transition-colors"
                                                    name="email"
                                                    type="email"
                                                    id="emailInput"
                                                    autoComplete="email"
                                                    autoFocus
                                                    placeholder={t("login-email-placeholder")}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            if (formData.email && passwordRef.current) {
                                                                passwordRef.current.focus();
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                                                {t("login-password-label")}
                                            </label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                                                <input
                                                    ref={passwordRef}
                                                    className="pl-10 pr-12 py-2.5 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 text-gray-900 placeholder-gray-400 transition-colors"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="passwordInput"
                                                    autoComplete="current-password"
                                                    placeholder={t("login-password-placeholder")}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => !prev)}
                                                    aria-label={showPassword ? t('hide-password','Hide password') : t('show-password','Show password')}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remember me */}
                                        <div className="flex items-start justify-between">
                                            <label className="inline-flex items-center gap-2 text-sm text-gray-700 select-none">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                />
                                                <span>{t('login-remember-me','Remember me')}</span>
                                            </label>
                                            <a className="text-primary text-sm hover:underline font-medium" href="#">{t("login-forgotpassword")}</a>
                                        </div>

                                        <button
                                            className="group w-full bg-primary text-white py-2.5 rounded-lg font-semibold text-base hover:bg-primary/90 active:scale-[0.985] transition-all duration-200 ease-in-out flex items-center justify-center shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            type="submit"
                                        >
                                            <span className="material-symbols-outlined mr-2 transition-transform duration-300 group-hover:translate-x-[2px]">login</span>
                                            {t("login-button-submit")}
                                        </button>

                                        <div className="text-center text-gray-600 text-xs sm:text-sm">
                                            <p className="mb-2 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-green-500 mr-1.5 text-lg">security</span>
                                                {t('login-security-msg','Your credentials are transmitted securely.')}
                                            </p>
                                            <p className="mt-2 text-gray-400">{t('login-version','Version')} v1.0.0</p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )


}
export default Login;

