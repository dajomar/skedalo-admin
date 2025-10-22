import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "./components/UI/Spinner";
import './App.css'

import { useAuthStore } from './store/authStore';


const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const DashBoard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Company = lazy(() => import("./pages/Company/Company"));


 const  App= () =>  {

  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="min-h-screen flex flex-col bg-gray-100">

          <Routes>
            <Route path="/login" element={<Login />} />
            {isAuthenticated ? (
              <Route element={<Home />}>
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/company" element={<Company />} />
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

