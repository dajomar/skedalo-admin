import type { ServiceCategories, Response } from '../types/index';
import { create } from "zustand";
import { listCategoryServiceByCompany, saveServiceCategory } from "../services/ServiceCategoryServices";

export type ServiceCategoriesState = {
   serviceCategories : ServiceCategories[]
   listCategoryServiceByCompany : (companyId: number) => Promise<void>
   saveCategoryService : (serviceCategory: ServiceCategories) => Promise<Response>
}


export const useServiceCategoriesStore = create<ServiceCategoriesState>((set , get) => ({

  serviceCategories: [],

  listCategoryServiceByCompany: async (companyId) => {
    const listServiceCategories: ServiceCategories[] = await listCategoryServiceByCompany(companyId);

    set(() => ({
      serviceCategories: listServiceCategories
    }));
  },

  saveCategoryService: async (serviceCategory) => {

    const response : Response = await saveServiceCategory(serviceCategory);

    if (response && response.dataNumber1) {
      const savedCategoryId = response.dataNumber1;

      // Clonar el objeto enviado y agregar el ID si era nuevo
      const updatedCategory: ServiceCategories = {
        ...serviceCategory,
        categoryId: savedCategoryId
      };

      const currentCategories = get().serviceCategories;
      const index = currentCategories.findIndex(cat => cat.categoryId === savedCategoryId);

      let updatedCategories;
      if (index !== -1) {
        // Actualizar existente
        updatedCategories = [...currentCategories];
        updatedCategories[index] = updatedCategory;
      } else {
        // Agregar nuevo
        updatedCategories = [...currentCategories, updatedCategory];
      }

      set(() => ({
        serviceCategories: updatedCategories
      }));
    }

    return response;
  }
}));
