
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'

import { NavLink } from 'react-router-dom';


interface SubMenuItem {
    id: number;
    name: string;
    redirectTo: string;
}

interface MenuItem {
    id: number;
    name: string;
    icon: string;
    redirectTo?: string;
    cssClass: string;
    cssActiveClass: string;
    cssInactiveClass?: string;
    subItems?: SubMenuItem[];
}

const cssClassMenuItem = 'flex items-center px-4 py-2 rounded-lg';
const cssActiveClassMenuItem = 'text-gray-700 bg-primary/10 rounded-lg text-primary font-semibold';
const cssInactiveClassMenuItem = 'text-gray-600 hover:bg-gray-100'; 

const menu: MenuItem[] = [
    { id: 1, name: 'Dashboard', icon: 'dashboard', redirectTo: '/dashboard', cssClass: cssClassMenuItem, cssActiveClass: cssActiveClassMenuItem, cssInactiveClass: cssInactiveClassMenuItem },
    { id: 2, name: 'Appointments', icon: 'calendar_today', redirectTo: '/appointments', cssClass: cssClassMenuItem, cssActiveClass: cssActiveClassMenuItem, cssInactiveClass: cssInactiveClassMenuItem,
     },
    { id: 3, name: 'Branches', icon: 'store', redirectTo: '/branches', cssClass: cssClassMenuItem, cssActiveClass: cssActiveClassMenuItem, cssInactiveClass: cssInactiveClassMenuItem },
    { 
        id: 4, 
        name: 'Services', 
        icon: 'design_services', 
        cssClass: cssClassMenuItem, 
        cssActiveClass: cssActiveClassMenuItem, 
        cssInactiveClass:cssInactiveClassMenuItem,
        subItems: [
            { id: 41, name: 'Service List', redirectTo: '/services' },
            { id: 42, name: 'Categories', redirectTo: '/service-categories' },
        ]
    },
    { id: 5, name: 'Resources', icon: 'group', cssClass: cssClassMenuItem, cssActiveClass: cssActiveClassMenuItem, cssInactiveClass: cssInactiveClassMenuItem, 
      redirectTo:'/resources'

    },
    { id: 6, name: 'Settings', icon: 'settings', redirectTo: '/company', cssClass: cssClassMenuItem, cssActiveClass: cssActiveClassMenuItem, cssInactiveClass: cssInactiveClassMenuItem }
]

export default function MenuBar() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false); // controla el sidebar en móvil
    const [expandedItems, setExpandedItems] = useState<number[]>([]);

    const toggleMenu = () => setIsOpen(!isOpen);
    
    const toggleSubMenu = (itemId: number) => {
        setExpandedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    // Block body scroll when mobile menu is open
    useEffect(() => {
        // Only apply on mobile screens (< 1024px based on lg: breakpoint)
        const isMobile = window.innerWidth < 1024;
        
        if (isOpen && isMobile) {
            // Save current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        return () => {
            // Cleanup on unmount
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isOpen]);


    return (
        <>
            {/* Hamburger Menu Button - Mobile Only */}
            <button 
                className={`lg:hidden fixed top-4 z-50 p-2.5 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all duration-300 ${
                    isOpen ? 'left-[200px]' : 'left-4'
                }`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <div className="w-6 h-5 flex flex-col justify-between">
                    <span 
                        className={`block h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                            isOpen ? 'rotate-45 translate-y-2' : ''
                        }`}
                    />
                    <span 
                        className={`block h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                            isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                        }`}
                    />
                    <span 
                        className={`block h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                            isOpen ? '-rotate-45 -translate-y-2' : ''
                        }`}
                    />
                </div>
            </button>

            {/* <aside className="w-64 flex-shrink-0 bg-white text-gray-800 hidden lg:flex flex-col"> */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col
        `}
            >



                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <span className="material-symbols-outlined text-primary text-3xl mr-2">raven</span>
                    <h1 className="text-xl font-bold">Skedalo</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">

                    {menu.map((menuItem) => (
                        <div key={menuItem.id}>
                            {menuItem.subItems ? (
                                <>
                                    <button
                                        onClick={() => toggleSubMenu(menuItem.id)}
                                        className={`w-full ${menuItem.cssClass} ${menuItem.cssInactiveClass} text-left`}
                                    >
                                        <span className="material-symbols-outlined mr-3">{menuItem.icon}</span>
                                        <span className="flex-1">{menuItem.name}</span>
                                        <span className={`material-symbols-outlined transition-transform ${
                                            expandedItems.includes(menuItem.id) ? 'rotate-180' : ''
                                        }`}>
                                            expand_more
                                        </span>
                                    </button>
                                    {expandedItems.includes(menuItem.id) && (
                                        <div className="ml-8 mt-2 space-y-2">
                                            {menuItem.subItems.map((subItem) => (
                                                <NavLink
                                                    key={subItem.id}
                                                    to={subItem.redirectTo}
                                                    className={({ isActive }) =>
                                                        `flex items-center px-4 py-2 rounded-lg ${
                                                            isActive
                                                                ? 'text-primary bg-primary/10 font-semibold'
                                                                : 'text-gray-600 hover:bg-gray-100'
                                                        }`
                                                    }
                                                >
                                                    {subItem.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <NavLink
                                    to={menuItem.redirectTo!}
                                    className={({ isActive }) =>
                                        `${menuItem.cssClass} ${
                                            isActive
                                                ? menuItem.cssActiveClass
                                                : menuItem.cssInactiveClass
                                        }`
                                    }
                                    onClick={toggleMenu}
                                >
                                    <span className="material-symbols-outlined mr-3">{menuItem.icon}</span>
                                    {menuItem.name}
                                </NavLink>
                            )}
                        </div>
                    ))}

                </nav>
                <div className="px-4 py-6">
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                        <h3 className="font-bold text-gray-800">Need Help?</h3>
                        <p className="text-sm text-gray-600 mt-1">Contact our support team.</p>
                        <button
                            className="mt-4 w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary/90">Contact
                            Us</button>
                    </div>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                    onClick={toggleMenu}
                />
            )}

        </>
    )


}
