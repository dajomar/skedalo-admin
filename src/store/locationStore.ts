import type { Cities, Countries } from './../types/index';
import { create } from "zustand";
import type { States, StatesPK } from "../types";
import { listCities, listStates, listCountries } from "../services/LocationServices";

export type LocationState = {
   countries : Countries[]
   states : States[]
   cities : Cities[]
   listCountries : () => Promise<void>
   listStates : (codPais: string) => Promise<void>
   listCities : (departamento : StatesPK) => Promise<void>
}


export const useLocationStore = create<LocationState>((set) => ({
    
    countries: [],

    states : [],
    
    cities : [],

    listCountries: async () => {

        const listaPaises = await listCountries()
        set({
            countries : listaPaises
        })

    },
  
    listStates: async (codPais : string) => {

        const listaDeptos = await listStates(codPais)
        set({
              states : listaDeptos
        })

    },    

    listCities: async (departamento : StatesPK) => {

        const listaCiudades = await listCities(departamento)
        set({
              cities : listaCiudades
        })

    }         

}));