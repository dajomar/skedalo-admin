import { axiosAPI } from "@/api/axios";
import type { Branch, BranchDTO, Business } from "@/types";


export const getBusinessById = async (idCompany: number): Promise<Business> => {
    // const url: string = `/companies/find/${idCompany}`;
    const url: string = `/find/${idCompany}`;
  
    const response = await axiosAPI<Business>({ url, method: 'get' })
  
    console.log(response.data)
    return response.data;
  
  }
  
  // export const getBranchId = async (idSede: number): Promise<Branch> => {
  //   // const url: string = `/branches/find/${idSede}`;
  //   const url: string = `/find/${idSede}`;
  
  //   const response = await axiosAPI<Branch>({ url, method: 'get' })
  
  //   return response.data;
  
  // }


  //export const getBranchByCompanyAndBranchId = async ( companyId:number, branchId:number ):Promise<BranchDTO[]>  => {
  export const getBranchByCompanyAndBranchId = async ( companyId:number, branchId:number ):Promise<BranchDTO | null >  => {
    const url: string = `/findCompaniesWithBranchesByCompanyId/${companyId}`;
  
    

    const response = await axiosAPI<BranchDTO[]>({ url, method: 'get' })

  
    return response.data.find( branch  => branch.branchId === branchId && branch.companyId === companyId ) || null;

    //return response.data.filter( branch  => branch.branchId === branchId && branch.companyId === companyId );
  
    //return response.data;



  }

  export const getBranchesCompanyByCompanyId = async (companyId:number):Promise<BranchDTO[]> => {
    
    const url: string = `/findCompaniesWithBranchesByCompanyId/${companyId}`;
  
    const response = await axiosAPI<BranchDTO[]>({ url, method: 'get' })
  
    return response.data;

  }
  
  // export const getBusiness = async (): Promise<Business[]> => {
  
  //   const url: string = '/companies/list';
  
  //   const response = await axiosAPI<Business[]>({ url, method: 'get' })
    
  //   return response.data; 
  
  
  // }
  
  export const getBranches = async ():Promise<BranchDTO[]> => {
  
    const url: string = '/findCompaniesWithBranches';
  
    const response = await axiosAPI<BranchDTO[]>({ url, method: 'get' })
  
    return response.data;
  
  }
  