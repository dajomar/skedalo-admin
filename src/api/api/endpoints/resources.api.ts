import { axiosAPI } from "@/api/axios";

import type{ Schedule, ServiceStaffDTO, Staff } from "@/types";


export const getStaffByBranch1 = async ( branchId:number ):Promise<Staff[]> => {

    const url: string = `/listByBranch/${branchId}`
  
    const response = await axiosAPI<Staff[]>({ url, method: 'get' })
  
    return response.data;
  

}

export const getStaffByBranch = async ( branchId:number ):Promise<Staff[]> => {

  const url: string = `/findResourcesByBranch/${branchId}`

  const response = await axiosAPI<Staff[]>({ url, method: 'get' })

  
  return response.data;


}


// export const getResourceByCompanyService = async (idSede: number, idService: number): Promise<ServiceStaff[]> => {

//     const url: string = `/resources/listByBranchAndService/${idSede}/${idService}`
  
//     const response = await axiosAPI<ServiceStaff[]>({ url, method: 'get' })
  
//     return response.data;
  
//   }
  
  export const getResourcesByBranchService = async (idBranch: number, idService: number): Promise<ServiceStaffDTO[]> => {
  
    const url: string = `/findResourcesByBranchAndService/${idBranch}/${idService}`
  
    const response = await axiosAPI<ServiceStaffDTO[]>({ url, method: 'get' })
  
    return response.data;
  
  }
  
  
  export const getServiceProviderSchedule = async (idCompany: number, idProvider: number | null, idService: number, fecha: string, fechaFin: string): Promise<Schedule[]> => {
  
    try {
      const url: string = `/availableSchedulesByDateRange`;
      const params = {
        idSede: idCompany,
        idRecurso: idProvider,
        fecha, //"2025-08-20",
        fechaFin,// "2025-08-21",
        idServicio: idService
      }
  
      const response = await axiosAPI<Schedule[]>({ url, data:params, method: 'post', })
      return response.data;
      
    } catch (error) {
      
      throw Error('Error obteniendo horarios por recurso ' + error)
    } finally {
  
  
    }
  
  
  
  
  
  
  }
  