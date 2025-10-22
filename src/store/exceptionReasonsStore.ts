import type { ExceptionReasons, Response } from './../types/index';
import { create } from "zustand";
import { listByCompany, saveListExceptionReasons } from "../services/ExceptionReasonsServices";

export type ExceptionReasonsState = {
   exceptionReasonsList : ExceptionReasons []
   listExceptionReasonsByCompany : (companyId : number) => Promise<void>
   saveListExceptionReasons : (dataList: ExceptionReasons[]) => Promise<Response>
}


export const useExceptionReasons = create<ExceptionReasonsState>((set) => ({
    
    exceptionReasonsList: [],

    listExceptionReasonsByCompany: async (companyId) => {
       
      const list : ExceptionReasons[] = await listByCompany(companyId)

      set(() => ({
        exceptionReasonsList: list
      }))

    },

    saveListExceptionReasons: async (dataList) => {

        const response : Response = await saveListExceptionReasons(dataList);
       
        return response;
    }
   
}));