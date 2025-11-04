import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const useTokenExpirationCheck = () => {
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);
    const checkIntervalRef = useRef<number>(0);

    useEffect(() => {
        const checkTokenExpiration = () => {
            const expirationTime = sessionStorage.getItem('tokenExp');
            if (!expirationTime) {
                logout();
                navigate('/login');
                return;
            }

            const expTime = parseInt(expirationTime, 10);
            const currentTime = Date.now();

            if (currentTime >= expTime) {
                logout();
                navigate('/login');
            }
        };

        // Verificar al montar el componente
        checkTokenExpiration();

        // Verificar cada minuto
        checkIntervalRef.current = window.setInterval(checkTokenExpiration, 60000);

        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
        };
    }, [logout, navigate]);
};