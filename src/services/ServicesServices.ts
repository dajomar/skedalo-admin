import api from "@/api/api/axios";
import type { Services } from "@/types";




export async function listServicesByCompany(companyId : number) {
    
    const url = `/services/listByCompany/${companyId}`

    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}


export async function saveService(service : Services) {
    
    const url = "/services/save"

    const {data} = await api.post(url, service);    

    if (data){        
       return data
    }

}
