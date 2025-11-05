
import { getBranchByCompanyAndBranchId } from "@/services/EmpresaServices";
import type { Branch } from "@/types"
import { useEffect, useState } from "react";


// Nuevo tipo de retorno
type UseBranchReturn = {
  branch: Branch | null;
  loading: boolean;
};

export const useBranchByBranchId = ( branchId:number|null):UseBranchReturn  => {

    const [branch, setBranch] = useState<Branch | null >(null); 
    
    const [loading, setLoading] = useState<boolean>(false);
    
    if( !branchId ) return { branch, loading }; 

    useEffect(() => {
        const fetchBranch = async () => {
          setLoading(true); 
          try{
            const branchData = await getBranchByCompanyAndBranchId(branchId);
            setBranch(branchData); 
            
          }catch(error){
            console.error( "Error getting branch by id => ", error ); 
          }finally {
            setLoading(false); // al finalizar
          }
          
        }
        fetchBranch(); 
      },[branchId])


    return { branch, loading };

}