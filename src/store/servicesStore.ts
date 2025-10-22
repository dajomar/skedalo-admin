import type { Response, Services } from './../types/index';
import { create } from "zustand";
import { listServicesByCompany, saveService } from "../services/ServicesServices";

export type ServicesState = {
   services : Services[]
   listServicesByCompany : (companyId : number) => Promise<void>
   saveService : (service: Services) => Promise<Response>
}


export const useServicesStore = create<ServicesState>((set, get) => ({
    
    services: [],

    listServicesByCompany: async (companyId) => {
       
      const listServices : Services[] = await listServicesByCompany(companyId)

      set(() => ({
        services: listServices
      }))

    },

    saveService: async (service) => {

        const response : Response = await saveService(service);
    
        if (response && response.dataNumber1) {
            const savedServiceId = response.dataNumber1;
    
            // Clonar el objeto enviado y agregar el ID si era nuevo
            const updatedService: Services = {
            ...service,
            serviceId: savedServiceId
            };
    
            const currentServices = get().services;
            const index = currentServices.findIndex(serv => serv.serviceId === savedServiceId);
    
            let updatedServices;
            if (index !== -1) {
            // Actualizar existente
            updatedServices = [...currentServices];
            updatedServices[index] = updatedService;
            } else {
            // Agregar nuevo
            updatedServices = [...currentServices, updatedService];
            }
    
            set(() => ({
            services: updatedServices
            }));
        }
    
        return response;
    }
   
}));