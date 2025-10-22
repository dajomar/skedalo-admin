import api from "@/api/api/axios";
import type { ExceptionReasons } from "@/types";



export async function listByCompany(companyId : number) {
    
    const url = `/exceptionReasons/listByCompany/${companyId}`

    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}


export async function saveExceptionReasons(exceptionReason : ExceptionReasons) {
    
    const url = "/exceptionReasons/save"

    const {data} = await api.post(url, exceptionReason);    

    if (data){        
       return data
    }

}

export async function saveListExceptionReasons(exceptionReasons : ExceptionReasons[]) {
    
    const url = "/exceptionReasons/saveList"

    const {data} = await api.post(url, exceptionReasons);    

    if (data){        
       return data
    }

}


