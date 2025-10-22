
import { useTranslation } from 'react-i18next'

import { NavLink } from 'react-router-dom';


interface MenuItem {
    id:                 number;
    name:               string;
    icon:               string; 
    redirectTo:         string;
    cssClass:           string;
    cssActiveClass:     string;
    cssInactiveClass?:   string; 

}

const menu:MenuItem[] = [  
    { id:1, name:'Dashboard',icon:'dashboard',redirectTo:'/dashboard',cssClass:'flex items-center px-4 py-2 rounded-lg',cssActiveClass:'text-gray-700 bg-primary/10 rounded-lg text-primary font-semibold', cssInactiveClass:'text-gray-600 hover:bg-gray-100'},
    { id:2, name:'Appointments',icon:'calendar_today',redirectTo:'/',cssClass:'flex items-center px-4 py-2 rounded-lg',cssActiveClass:'text-gray-700 bg-primary/10 rounded-lg text-primary font-semibold' ,cssInactiveClass:'text-gray-600 hover:bg-gray-100'},
    { id:3, name:'Clients',icon:'people',redirectTo:'/',cssClass:'flex items-center px-4 py-2 rounded-lg',cssActiveClass:'text-gray-700 bg-primary/10 rounded-lg text-primary font-semibold' ,cssInactiveClass:'text-gray-600 hover:bg-gray-100'},
    { id:4, name:'Services',icon:'design_services',redirectTo:'/',cssClass:'flex items-center px-4 py-2 rounded-lg',cssActiveClass:'text-gray-700 bg-primary/10 rounded-lg text-primary font-semibold' ,cssInactiveClass:'text-gray-600 hover:bg-gray-100'},
    { id:5, name:'Settings',icon:'settings',redirectTo:'/company',cssClass:'flex items-center px-4 py-2 rounded-lg',cssActiveClass:'text-gray-700 bg-primary/10 rounded-lg text-primary font-semibold' ,cssInactiveClass:'text-gray-600 hover:bg-gray-100'},
    
]

export default function MenuBar() {
    const { t } = useTranslation()


    return (
        <>

            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <span className="material-symbols-outlined text-primary text-3xl mr-2">raven</span>
                <h1 className="text-xl font-bold">Skedalo</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">

                { menu.map((menuItem) =>(
                    <NavLink key={menuItem.id}
                    to={menuItem.redirectTo}
                    className={({ isActive }) =>
                        `${menuItem.cssClass} ${(isActive) 
                            ? menuItem.cssActiveClass 
                            : menuItem.cssInactiveClass
                        }`
                    }
                >
                    <span className="material-symbols-outlined mr-3">{menuItem.icon} </span>
                    {menuItem.name}

                </NavLink>

                ) ) }

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

        </>
    )


}
