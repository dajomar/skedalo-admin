import api from "@/api/api/axios";
import type { ServiceCategories } from "@/types";



export async function listCategoryServiceByCompany(companyId : number) {
    
    const url = `/servicesCategories/listByCompany/${companyId}`

    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}


export async function saveServiceCategory(serviceCategory : ServiceCategories) {
    
    const url = "/servicesCategories/save"

    const {data} = await api.post(url, serviceCategory);    

    if (data){        
       return data
    }

}
