import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import LoadingSpinner from "./components/UI/Spinner";
import './App.css'

import { useAuthStore } from './store/authStore';

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const DashBoard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Company = lazy(() => import("./pages/Company/Company"));
const ServicesCompany = lazy(() => import("./pages/ServicesCompany/Services"));
const Branches = lazy(() => import("./pages/Branches/Branches"));
const ResourcesPage = lazy(() => import("./pages/Resources/Resources"));
const ServiceCategoriesPage = lazy(() => import("./pages/ServiceCategories/ServicesCategories"));

const  UserProfile = lazy(() => import("./pages/UserProfile/UserProfile"));
const  DayViewCalendar = lazy(() => import("./pages/Appointments/Appointments"));
const  AppointmentsDetails = lazy(() => import("./pages/Appointments/components/Details"));


const App = () => {
    const { isAuthenticated, logout } = useAuthStore();
  
  // Verificar token expirado al cargar la app
  useEffect(() => {
    const checkTokenExpiration = () => {
      const exp = sessionStorage.getItem("tokenExp");
      if (exp && Date.now() >= Number(exp)) {
        logout();
        return false;
      }
      return true;
    };

    // Verificar inmediatamente
    if (!checkTokenExpiration()) {
      window.location.href = '/login';
    }

    // Verificar cada minuto
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [logout]);
  

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="min-h-screen flex flex-col bg-gray-100">

          <Routes>
            <Route path="/login" element={<Login />} />
            {isAuthenticated ? (
              <Route element={<Home />}>
                <Route path="/" element={<DashBoard />} />
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/company" element={<Company />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/services" element={<ServicesCompany />} />
                <Route path="/service-categories" element={<ServiceCategoriesPage />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/appointments" element={<DayViewCalendar />} />
                <Route path="/details/branch/:branchId/appointment/:appointmentId" element={<AppointmentsDetails />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </div>
      </Suspense>
    </Router>
  )
}


export default App;

