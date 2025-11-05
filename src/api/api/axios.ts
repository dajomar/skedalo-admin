import axios from "axios";
import i18n from "../../locales/i18n";

//import { showAlertSessionExpired } from "../utils/sweetalert2";
import { getURLApiServer } from "@/helpers/helpers";
import { showAlertSessionExpired } from "@/utils/sweetalert2";


const api = axios.create({
  baseURL: getURLApiServer(),
});



// Interceptor para agregar el idioma en cada request
api.interceptors.request.use((config) => {
  const userLang = i18n.language; // puede estar vacío si i18n no está listo
  const storedLang = localStorage.getItem("lang");
  const browserLang = (navigator.language || "es").split("-")[0];

  const language = userLang || storedLang || browserLang || "es";

  config.headers["Accept-Language"] = language;
  return config;
});


// Interceptor para agregar el accessToken en cada request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});


api.interceptors.request.use(async (config) => {

  const token = sessionStorage.getItem("tokenBookify");
  const exp = sessionStorage.getItem("tokenExp");

  // Si tenemos fecha de expiración y ya pasó...
  if (exp && Date.now() >= Number(exp)) {

    const refreshToken = sessionStorage.getItem("refreshTokenBookify");

    if (refreshToken) {
      try {
        const res = await axios.post(getURLApiServer() + "/users/refresh", { refreshToken });

        const newAccessToken = res.data.accessToken;
        const newExpiresIn = res.data.expiresIn; // segundos

        // Calculamos nuevo tiempo de expiración
        const newExp = Date.now() + newExpiresIn * 1000;

        // Guardamos de nuevo
        sessionStorage.setItem("tokenBookify", newAccessToken);
        sessionStorage.setItem("tokenExp", String(newExp));

        config.headers["Authorization"] = newAccessToken;
      } catch {
        // Si falla el refresh → sesión expirada
        sessionStorage.removeItem("tokenBookify");
        sessionStorage.removeItem("refreshTokenBookify");
        sessionStorage.removeItem("tokenExp");

        showAlertSessionExpired();
        console.clear()
      }
    }
  } else if (token) {
    config.headers["Authorization"] = token;
  }

  return config;
});






export default api;
