import api from "@/api/api/axios";
import type { Branch, Companies, CompaniesEmailSettings } from "@/types";


export async function saveCompany(company : Companies) {
    
    const url = "/companies/save"

    const {data} = await api.post(url, company);    

    if (data){        
       return data
    }

}


export async function saveCompanyEmailSettings(companyEmailSettings : CompaniesEmailSettings) {
    
    const url = "/companiesEmailSettings/save"

    const {data} = await api.post(url, companyEmailSettings);    

    if (data){        
       return data
    }

}


export async function findCompany(companyId : number) {
    
    const url = `/companies/find/${companyId}`

    const {data} = await api.get(url); 
         
    if (data){        
       return data
    }

}

export async function findCompanyEmailSettings(companyId : number) {
    
    const url = `/companiesEmailSettings/companyId/${companyId}`

    const {data} = await api.get(url); 
         
    if (data){        
       return data
    }

}

 export const getBranchByCompanyAndBranchId = async ( branchId:number ):Promise<Branch | null >  => {
    const url: string = `branches/find/${branchId}`;
  
    const {data} = await api.get(url);

  
    if (data){        
       return data 
    }
    return null; 


  }

export async function uploadImage (file: File,
                                  companyId: number,
                                  type: string) {
    
    try {
        const formData = new FormData();
        formData.append("file", file); // el archivo
        formData.append("companyId", companyId.toString()); // convertir a string
        formData.append("type", type);
    
        const url = `/companies/upload-image`

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
        console.error("Error al subir la imagen:", error);
      }

}