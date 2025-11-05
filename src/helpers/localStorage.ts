/**
 * Guarda datos en el localStorage
 * @param key Clave para almacenar los datos
 * @param data Datos a almacenar
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

/**
 * Obtiene datos del localStorage
 * @param key Clave para recuperar los datos
 * @param defaultValue Valor por defecto si no se encuentra la clave
 * @returns Los datos almacenados o el valor por defecto
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
};

/**
 * Elimina datos del localStorage
 * @param key Clave a eliminar
 */
export const removeFromLocalStorage = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};