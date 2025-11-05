import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import type { Branch, Branches } from "@/types"
import { t } from "i18next"
import { useEffect, useState } from "react";


export const BranchSelector = ({branches, onBranchSelected}:{branches:Branches[],onBranchSelected:( branch:number | '' )=> void}) => {

    const [selectedBranch, setSelectedBranch] = useState<number | '' >(''); 
    

    useEffect(()=>{

        if( getFromLocalStorage('branch',selectedBranch)) setSelectedBranch(getFromLocalStorage('branch',selectedBranch));

    },[])

    useEffect(() => {

        if( selectedBranch === '' ) return ;  
        
        saveToLocalStorage('branch',selectedBranch);
        onBranchSelected(selectedBranch);

    },[selectedBranch]);


    

    return (
        <>

             <div className="relative min-w-[200px]">
                <label htmlFor="branch-select" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('branch')}
                </label>
                <div className="relative">
                    <select
                        id="branch-select"
                        value={selectedBranch ?? ''}
                        onChange={(e) => setSelectedBranch(Number(e.target.value))}
                        className="
              block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
              focus:ring-blue-500 focus:border-blue-500 rounded-lg transition-shadow
              bg-white hover:bg-gray-50 cursor-pointer appearance-none
                "
                    >
                        {branches.map((branch) => (
                            <option key={branch.branchId} value={branch.branchId || ''}>
                                {branch.branchName}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        {/* <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                         */}

                    </div>
                </div>
            </div>


        </>
    )
}