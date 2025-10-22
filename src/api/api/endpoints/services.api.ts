
import { axiosAPI } from "@/api/axios";
import type { Service } from "@/types";

// export const getServiceByID = async (serviceId:number): Promise<Service> => {

//     const url: string = `/services/find/${serviceId}` ;
  
//     const response = await axiosAPI({ url, method: 'get' })
  
//     return response.data;
  
//   }
  
  
  export const getServicesByCompanyID = async (companyId: number): Promise<Service[]> => {
  
    // const url: string = `/services/listByCompany/${idCompany}`
    const url: string = `/findServicesByCompanyId/${companyId}`
  
    const response = await axiosAPI<Service[]>({ url, method: 'get' })
  
    return response.data
  
  }
  
  export const getServicesByBranchID = async (idBranch: number): Promise<Service[]> => {
  
  
    // const url: string = `/services/findServicesByBranchId/${idBranch}`
    const url: string = `/findServicesByBranchId/${idBranch}`
  
    const response = await axiosAPI<Service[]>({ url, method: 'get' })
  
    return response.data
  
  }
  