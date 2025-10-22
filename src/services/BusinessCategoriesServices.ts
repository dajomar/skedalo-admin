
import api from "@/api/api/axios";


export async function listBusinessCategories() {
    
    const url = "/businessCategories/list"

    const {data} = await api.get(url);    
    
    if (data){        
       return data
    }

}

