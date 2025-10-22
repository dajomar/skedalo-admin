// src/store/empresaStore.ts
import { create } from "zustand";
import type { Response, Branches } from "../types";
import {  guardarSede, listarSedes } from "../services/SedesServices";


interface SedeState {
  sedeSeleccionada: Branches
  sedes :Branches[]
  respuesta : Response
  listarSedes:  (companyId: number) => Promise<void>
  guardarSede:  (branch: Branches) => Promise<Response>
  setRespuestaNull : () => void;
}

const initialSede: Branches = {
    branchId:  null,
    branchName: "",
    address: "",
    phoneNumbers: "",
    status: "",
    companyId: 0,
    cities: {
        cityId : "",
        cityName :  "" ,
        dianCode : "", 
        states : {
            statesPK : {
              countryId : "",
              stateId : ""
            },
            name : "",
            dianCode : "",
            displayOrder : 0
        }
    },
    timezone: "America/Bogota"
};

export const useSedeStore = create<SedeState>((set) => ({

    sedeSeleccionada: initialSede,

    sedes: [],    

    respuesta : null,


    listarSedes: async (companyId) => {
       
      const listaSedes : Branches[] = await listarSedes(companyId)

      set(() => ({
        sedes: listaSedes
      }))

    }, 

    guardarSede: async (data) => {
      
      const resp : Response = await guardarSede(data)
      
      set((state) => ({
        sedeSeleccionada: { ...state.sedeSeleccionada, ...data,  },
        respuesta : resp
      }))

      return resp
    },    

  resetSede: () => set({ sedeSeleccionada: initialSede }),

  setRespuestaNull : () => set({respuesta : null})

}));