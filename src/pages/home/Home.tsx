

import { useTranslation } from 'react-i18next'
import { Outlet } from "react-router-dom";
import MenuBar from '../../components/UI/MenuBar'
import { Header } from '@/components/UI/Header';


const Home = () => {
    const { t } = useTranslation()


    return (
        <>
            <div className="flex h-screen w-full overflow-hidden">
                {/* Sidebar */}
                
                <MenuBar />

                {/* Contenedor principal */}
                <main className="flex flex-col flex-1">
                    {/* Header fijo */}
                    <Header />

                    {/* Contenedor scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        <Outlet />
                    </div>
                </main>
            </div>



        </>
    )


}

export default Home;
