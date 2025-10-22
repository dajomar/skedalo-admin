import type { Response, Schedules } from './../types/index';
import { create } from "zustand";
import { listByResource,  saveList } from "../services/SchedulesServices";

export type SchedulesState = {
   selectedResourceId : number 
   setSelectedResourceId : (resourceId : number) => void
   schedules : Schedules[]
   listByResource : (resourceId : number) => Promise<void>
   saveList : (schedules: Schedules[]) => Promise<Response>
}


export const useSchedulesStore = create<SchedulesState>((set) => ({
    
    selectedResourceId : 0,

    setSelectedResourceId: (resourceId) => {
        set(() => ({
            selectedResourceId: resourceId
        }));
    },

    schedules: [],

    listByResource: async (resourceId) => {
       
      const listSchedules : Schedules[] = await listByResource(resourceId)

      set(() => ({
        schedules: listSchedules
      }))

    },

    saveList: async (schedules) => {
        
        const response : Response = await saveList(schedules);
    
        return response;
    }
       
}));