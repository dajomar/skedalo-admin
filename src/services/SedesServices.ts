import api from "@/api/api/axios";
import type { Branches } from "@/types";


export async function guardarSede(branch : Branches) {
    
    const url = "/branches/save"

    const {data} = await api.post(url, branch);    

    if (data){        
       return data
    }

}


export async function buscarSede(branchId : number) {
    
    const url = `/branches/find/${branchId}`

    const {data} = await api.get(url);    
    
    if (data){        
       return data
    }

}

export async function listarSedes(companyId : number) {
    
    const url = `/branches/listByCompany/${companyId}`

    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}