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
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center">
                    <button className="lg:hidden mr-4">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <h2 className="mr-10 text-2xl font-bold text-gray-800">{capitalizeFirstLetter(location.pathname.substring(1).split("/")[0])}</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <LanguageSwitcher />
                    <button className="text-gray-500 hover:text-gray-700">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button 
                            className="flex items-center focus:outline-none" 
                            onClick={() => setOpen(!open)}
                        >
                            <img 
                                alt="User avatar" 
                                className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrY2UfF-BMmaXkVlQ0RyLcutH4BRmID8UT7eN16aLtMA6hjmPjr8Vhraq17lRibwA4L8rn0MpSpM1UTV-tvlJ0vyjsjplc9VKx-PTifvwVACZ5qUYJjCsDUwQpSoem9s1IbNhCk60pUNR3aHgaGRMffLYFQmZBEHNSq-LPl1H4C76O3_B0hTaU5hLohYK9OD060U6oJDtmzgbAmV1yUOhPHgLMHVIJYsK0slMTcLqhUR4Be9Ohj59PQZbPau82Cn_SjF9ktcbGTjw" 
                            />
                            <div className="ml-2 hidden md:block">
                                <p className="text-sm font-semibold text-gray-800">{userInfo?.firstName} {userInfo?.lastName}</p>
                                <p className="text-xs text-gray-500">{userInfo?.role}</p>
                            </div>
                            <span className={`material-symbols-outlined ml-2 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>
                    </div>

                    {open && (
                        <div className="absolute right-6 top-16 w-56 origin-top-right rounded-lg border border-gray-200 
                            bg-white shadow-lg z-50">
                            <div className="p-4 border-b border-gray-200">
                                <p className="text-sm font-semibold text-gray-800">{userInfo?.firstName} {userInfo?.lastName}</p>
                                <p className="text-xs text-gray-500 mt-1">{userInfo?.email}</p>
                                <div className="mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block">
                                    {userInfo?.role}
                                </div>
                            </div>
                            <ul className="py-2">
                                {userMenuOptions.map((option) => (
                                    <li key={option.id}>
                                        <button
                                            onClick={() => {
                                                // close menu first
                                                setOpen(false);
                                                
                                                // If action is a string path, navigate
                                                if (typeof option.action === 'string') {
                                                    if (option.action === 'logout') {
                                                        // perform logout then navigate to login
                                                        logout();
                                                        navigate('/login');
                                                    } else {
                                                        navigate(option.action as string);
                                                        //console.log("Navigated to:", option.action)
                                                    }
                                                } else if (typeof option.action === 'function') {
                                                    option.action();
                                                }
                                            }}
                                            className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 
                                            ${option.className || ''}`}
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
                    )}
                </div>
            </header>
        </>
    )
}