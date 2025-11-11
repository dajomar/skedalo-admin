

import { useTranslation } from 'react-i18next'
import { Outlet } from "react-router-dom";
import MenuBar from '../../components/UI/MenuBar'
import { Header } from '@/components/UI/Header';


const Home = () => {
    const { t } = useTranslation()


    return (
        <>
            <div className="flex min-h-[100dvh] h-full w-full overflow-x-hidden">
                {/* Sidebar */}
                
                <MenuBar />

                {/* Contenedor principal */}
                <main className="flex min-w-0 min-h-0 flex-col flex-1">
                    {/* Header fijo */}
                    <Header />

                    {/* Contenedor scrollable */}
                    <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 bg-gray-50 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
                        <div className="mx-auto w-full max-w-7xl">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>



        </>
    )


}

export default Home;
