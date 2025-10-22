import api from "@/api/api/axios";
import type { Schedules } from "@/types";



export async function listByResource(resourceId : number) {
    
    const url = `/schedules/listByResource/${resourceId}`

    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}


export async function save(schedule : Schedules) {
    
    const url = "/schedules/save"

    const {data} = await api.post(url, schedule);    

    if (data){        
       return data
    }

}


export async function saveList(schedules : Schedules[]) {
    
    const url = "/schedules/saveList"

    const {data} = await api.post(url, schedules);    

    if (data){        
       return data
    }

}
