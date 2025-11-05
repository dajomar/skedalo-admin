// src/store/authStore.ts
import { create } from "zustand";
import { changePassword, postLogin } from "../services/LoginServices";
import type { Response, UserLogin } from "@/types";
import api from "@/api/api/axios";


interface AuthState {
  isAuthenticated: boolean;
  authenticatedUser: UserLogin;
  userId : number; //Id del usuario autenticado
  companyId : number  //ID de la empresa con la que el user se autenticó
  companyName : string  //companyName de la empresa con la que el usuario se autenticó
  defaultCurrency : string; //Modena por defecto de la empresa con la que se autenticó
  login: (email : string, password : string) => Promise<UserLogin>;
  changePassword: (email : string, currentPassword : string, newPassword : string) => Promise<Response>;
  logout: () => void;
  setCompanyName: (companyName: string) => void;
}

const usuarioAutenticadoInicial : UserLogin = {
    userId : 0,
    user : "",
    email : "",
    password : "",
    accessToken : "",
    refreshToken : "",
    expiresIn : 0,
    usersCompanies : []
}

export const useAuthStore = create<AuthState>((set) => ({   
  
  isAuthenticated: false,

  authenticatedUser : usuarioAutenticadoInicial,

  userId : 0,

  companyId : 0,

  companyName : "",

  defaultCurrency : "",

  login: async (email : string, password : string) => {

      const login: UserLogin = await postLogin(email, password)

      if (login?.accessToken!==null)
      {

         // Calculamos fecha exacta de expiración en milisegundos
         const expirationTime = Date.now() + login.expiresIn * 1000;

         sessionStorage.setItem("tokenBookify", login.accessToken)
         sessionStorage.setItem("refreshTokenBookify", login.refreshToken)
         sessionStorage.setItem("tokenExp", String(expirationTime));
         api.defaults.headers.common["Authorization"] = login.accessToken;   
         
         if (login.usersCompanies.length > 0)
         set({ isAuthenticated: true,
               authenticatedUser : login,
               userId : login.userId,
               companyId : login.usersCompanies[0].companyId,
               companyName : login.usersCompanies[0].companyName,
               defaultCurrency : login.usersCompanies[0].defaultCurrency
          })
      }
      else 
      {
         sessionStorage.setItem("tokenBookify", "")
         sessionStorage.setItem("refreshTokenBookify", "")
         sessionStorage.setItem("tokenExp", "")
         set({ isAuthenticated: false,
               authenticatedUser : usuarioAutenticadoInicial,
               userId : 0
          })
      }

      return login

  },

  changePassword: async (email : string, currentPassword : string, newPassword : string) => {
     
    const resp: Response = await changePassword(email, currentPassword, newPassword)

    return resp
  },

  logout: () => {
        set({ isAuthenticated: false, 
              authenticatedUser : usuarioAutenticadoInicial,
              userId : 0 }) 
        sessionStorage.setItem("tokenBookify", "")
        sessionStorage.setItem("refreshTokenBookify", "")
        sessionStorage.setItem("tokenExp", "")

        delete api.defaults.headers.common["Authorization"]; // 👈 limpia el header
  },


  setCompanyName: (companyName: string) => {
      set({ companyName });
  }

}));
