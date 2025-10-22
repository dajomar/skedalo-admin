
import axios from "axios";
import api from "@/api/api/axios";


import type { UserPasswordDTO } from "@/types";
import { getURLApiServer } from "@/helpers/helpers";

export type UserLogin = {
    user : string
    email : string
    password : string
    accessToken : string
}

// Cliente limpio (no arrastra headers ni interceptores)
const authApi = axios.create({
  baseURL: getURLApiServer(),
});

export async function postLogin(email : string, password : string) {
    
    const url = "/users/login"

    const userLogin : UserLogin = {
        user : "",
        email : email,
        password : password,
        accessToken : ""
    }

   // const {data} = (await api.post(url))

    const {data} = await authApi.post(url, userLogin, {
        headers: {
          "Content-Type": "application/json", // Asegura que el body sea JSON
        },
      });    
    
    //const result = UserLoginSchema.safeParse(data)

    if (data){        
       return data
    }

}


export async function changePassword(email : string, currentPassword : string, newPassword : string) {
    
    const url = "/users/changePassword"

    const userPasswordDTO : UserPasswordDTO = {
        email : email,
        currentPassword : currentPassword,
        newPassword : newPassword
    }

    const {data} = await api.post(url, userPasswordDTO, {
        headers: {
          "Content-Type": "application/json", // Asegura que el body sea JSON
        },
      });    
    
    if (data){        
       return data
    }

}