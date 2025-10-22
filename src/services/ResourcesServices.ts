import api from "@/api/api/axios";
import type { ResourcesServicesDTO } from "@/types";
import type { Resources } from "i18next";



export async function listResourcesByBranch(branchId : number) {
    
    const url = `/resources/listByBranch/${branchId}`

    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}

export async function listByBranchAndResource(branchId : number, resourceId: number) {

    const url = `/resources/listByBranchAndResource/${branchId}/${resourceId}`

    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}

export async function listResourcesByCompany(companyId : number) {
    
    const url = `/resources/listByCompany/${companyId}`

    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}


export async function saveResource(resource : Resources) {
    
    const url = "/resources/save"

    const {data} = await api.post(url, resource);    

    if (data){        
       return data
    }

}

export async function saveResourceServices(resourcesServicesDTO : ResourcesServicesDTO) {
    
    const url = "/resources/saveResourceServices"

    const {data} = await api.post(url, resourcesServicesDTO);    

    if (data){        
       return data
    }

}


export async function listResourcesServiceByBranch(branchId : number) {
    
    const url = `/resources/listResourcesByBranch/${branchId}`

    //return List<ResourcesServices>
    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}


export async function listResourcesServiceByBranchAndService(branchId : number, serviceId: number) {
    
    const url = `/resources/listByBranchAndService/${branchId}/${serviceId}`

    //return List<ResourcesServices>
    const {data} = await api.get(url);    

    if (data){        
       return data
    }

}

export async function uploadResourcePhoto (file: File, resourceId: number) {
    
    try {
        const formData = new FormData();
        formData.append("file", file); // el archivo
        formData.append("resourceId", resourceId.toString()); // convertir a string
    
        const url = `/resources/upload-photo`

        const {data} = await api.post(
          url,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            },
          }
        );

        if (data){        
           return data
        }        

      } catch (error) {
        console.error("Error al subir la foto:", error);
      }

}

