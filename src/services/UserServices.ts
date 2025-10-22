import api from "@/api/api/axios";
import type { UsersDTO } from "@/types";




export async function find(userId : number) {
    
    const url = `/users/find/${userId}`

    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}


export async function editUser(usersDTO : UsersDTO) {
    
    const url = "/users/edit"

    const {data} = await api.post(url, usersDTO);    

    if (data){        
       return data
    }

}