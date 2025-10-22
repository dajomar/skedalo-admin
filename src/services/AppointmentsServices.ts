import api from "@/api/api/axios";



export async function listByDateAndBranch(appointmentDate : string, branchId : number) {
    
    const url = `/appointments/listByDateAndBranch/${appointmentDate}/${branchId}`

    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}

export async function cancelAppointment(appointmentId : number) {
    
    const url = `/appointments/cancelAppointment/${appointmentId}`

    const {data} = await api.put(url);    

    if (data){        
       return data
    }

}


export async function confirmAppointment(appointmentId : number) {
    
    const url = `/appointments/confirmAppointment/${appointmentId}`

    const {data} = await api.put(url);    

    if (data){        
       return data
    }

}