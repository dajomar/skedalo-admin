import { capitalizeFirstLetter } from "@/helpers/helpers";
import { useLocation, useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import type { UsersDTO } from "@/types";
import { find } from "@/services/UserServices";


export const Header = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = useAuthStore();
    
    const [userInfo, setUserInfo] = useState<UsersDTO | null>(null);

    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const getUserData = async () => {
        const user: UsersDTO = await find(userId);
        setUserInfo(user);
        
    }

    useEffect(() => {
        getUserData();
    }, [userId]);
    
    

    // Cerrar el menú al hacer clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                //setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navigateTo = (path: string) => {
        console.log("navigating to:", path);
        navigate(path);
    }

    const logout = useAuthStore(state => state.logout);

    type MenuOption = { id: number; label: string; icon: string; action: string | (() => void); className?: string };

    const userMenuOptions: MenuOption[] = [
        { id: 1, label: 'Mi Perfil', icon: 'account_circle', action: '/profile' },
        { id: 2, label: 'Configuración', icon: 'settings', action: '/company' },
        { id: 3, label: 'Cambiar Empresa', icon: 'business', action: '/company' },
        { id: 4, label: 'Cerrar Sesión', icon: 'logout', action: 'logout', className: 'text-red-600 hover:bg-red-50' }
    ];

    


    return (
        <>
            <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 flex-shrink-0">
                {/* Left Section - Title */}
                <div className="flex items-center flex-1 min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                        {capitalizeFirstLetter(location.pathname.substring(1).split("/")[0])}
                    </h2>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Language Switcher - Hidden on small mobile */}
                    <div className="hidden sm:block">
                        <LanguageSwitcher />
                    </div>

                    {/* Notifications Button */}
                    <button 
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
                        aria-label="Notifications"
                    >
                        <span className="material-symbols-outlined text-xl sm:text-2xl">notifications</span>
                        {/* Notification Badge */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {/* User Menu */}
                    <div className="relative" ref={menuRef}>
                        <button 
                            className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20" 
                            onClick={() => setOpen(!open)}
                            aria-label="User menu"
                        >
                            <img 
                                alt="User avatar" 
                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover ring-2 ring-primary/20"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrY2UfF-BMmaXkVlQ0RyLcutH4BRmID8UT7eN16aLtMA6hjmPjr8Vhraq17lRibwA4L8rn0MpSpM1UTV-tvlJ0vyjsjplc9VKx-PTifvwVACZ5qUYJjCsDUwQpSoem9s1IbNhCk60pUNR3aHgaGRMffLYFQmZBEHNSq-LPl1H4C76O3_B0hTaU5hLohYK9OD060U6oJDtmzgbAmV1yUOhPHgLMHVIJYsK0slMTcLqhUR4Be9Ohj59PQZbPau82Cn_SjF9ktcbGTjw" 
                            />
                            <div className="ml-1 hidden lg:block text-left">
                                <p className="text-sm font-semibold text-gray-800 leading-tight">{userInfo?.firstName} {userInfo?.lastName}</p>
                                <p className="text-xs text-gray-500">{userInfo?.role}</p>
                            </div>
                            <span className={`material-symbols-outlined text-gray-500 transition-transform duration-200 text-lg sm:text-xl ${open ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>
                    </div>
                </div>

                {/* User Dropdown Menu */}
                {open && (
                    <>
                        {/* Backdrop for mobile */}
                        <div 
                            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                            onClick={() => setOpen(false)}
                        />
                        
                        {/* Menu */}
                        <div className="fixed right-2 top-14 sm:absolute sm:right-6 sm:top-16 w-[calc(100vw-1rem)] max-w-xs sm:w-64 origin-top-right rounded-lg border border-gray-200 bg-white shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-gray-200">
                                <p className="text-sm font-semibold text-gray-800">{userInfo?.firstName} {userInfo?.lastName}</p>
                                <p className="text-xs text-gray-500 mt-1 truncate">{userInfo?.email}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block">
                                        {userInfo?.role}
                                    </div>
                                    {/* Language Switcher for mobile in menu */}
                                    <div className="sm:hidden ml-auto">
                                        <LanguageSwitcher />
                                    </div>
                                </div>
                            </div>
                            <ul className="py-2">
                                {userMenuOptions.map((option) => (
                                    <li key={option.id}>
                                        <button
                                            onClick={() => {
                                                setOpen(false);
                                                
                                                if (typeof option.action === 'string') {
                                                    if (option.action === 'logout') {
                                                        logout();
                                                        navigate('/login');
                                                    } else {
                                                        navigate(option.action as string);
                                                    }
                                                } else if (typeof option.action === 'function') {
                                                    option.action();
                                                }
                                            }}
                                            className={`flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${option.className || ''}`}
                                        >
                                            <span className="material-symbols-outlined mr-3 text-lg">
                                                {option.icon}
                                            </span>
                                            {option.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </header>
        </>
    )
}