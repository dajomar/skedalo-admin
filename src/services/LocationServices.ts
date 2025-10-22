import api from "@/api/api/axios";
import type { StatesPK } from "@/types";



export async function listCountries() {
    
    const url = "/countries/list"

    const {data} = await api.get(url);    
    
    if (data){        
       return data
    }

}

export async function listStates(codPais : string) {
    
    const url = `/states/listByCountry/${codPais}`
    
    const {data} = await api.get(url);    
    
    if (data){        
       return data
    }

}

export async function listCities(statesPK : StatesPK) {
    
    const url = `/cities/listByState/${statesPK.countryId}/${statesPK.stateId}`

    const {data} = await api.get(url);    
    
    if (data){        
       return data
    }

}