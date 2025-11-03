import { capitalizeFirstLetter } from "@/helpers/helpers";
import { useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";


export const Header = () => {

    const location = useLocation(); // { pathname: "/dashboard", search: "", hash: "" }


    return (
        <>
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center">
                    <button className="lg:hidden mr-4">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <h2 className="mr-10 text-2xl font-bold text-gray-800">{capitalizeFirstLetter(location.pathname.substring(1))}</h2>
                </div>
                <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                    <button className="text-gray-500 hover:text-gray-700">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="flex items-center">
                        <img alt="User avatar" className="h-8 w-8 rounded-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrY2UfF-BMmaXkVlQ0RyLcutH4BRmID8UT7eN16aLtMA6hjmPjr8Vhraq17lRibwA4L8rn0MpSpM1UTV-tvlJ0vyjsjplc9VKx-PTifvwVACZ5qUYJjCsDUwQpSoem9s1IbNhCk60pUNR3aHgaGRMffLYFQmZBEHNSq-LPl1H4C76O3_B0hTaU5hLohYK9OD060U6oJDtmzgbAmV1yUOhPHgLMHVIJYsK0slMTcLqhUR4Be9Ohj59PQZbPau82Cn_SjF9ktcbGTjw" />
                        <div className="ml-2 hidden md:block">
                            <p className="text-sm font-semibold text-gray-800">Jane Doe</p>
                            <p className="text-xs text-gray-500">Business Owner</p>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}