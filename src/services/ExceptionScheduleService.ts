import api from "@/api/api/axios";
import type { ExceptionSchedule } from "@/types";



export async function listByResource(resourceId : number) {
    
    const url = `/exceptionSchedules/listByResource/${resourceId}`

    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}


export async function saveList(exceptionSchedules : ExceptionSchedule[]) {
    
    const url = "/exceptionSchedules/saveList"

    const {data} = await api.post(url, exceptionSchedules);    

    if (data){        
       return data
    }

}
