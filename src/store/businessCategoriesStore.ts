import type { BusinessCategories } from './../types/index';
import { create } from "zustand";
import { listBusinessCategories } from "../services/BusinessCategoriesServices";

export type BusinessCategoriesState = {
   businessCategories : BusinessCategories[]
   listBusinessCategories : () => Promise<void>
}


export const useBusinessCategoriesStore = create<BusinessCategoriesState>((set) => ({
    
    businessCategories: [],

    listBusinessCategories: async () => {
       
      const listCategories : BusinessCategories[] = await listBusinessCategories()

      set(() => ({
        businessCategories: listCategories
      }))

    }

   
}));