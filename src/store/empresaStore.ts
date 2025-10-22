// src/store/empresaStore.ts
import { create } from "zustand";
import type { Companies, CompaniesEmailSettings, Response } from "../types";
import { findCompany, saveCompany, saveCompanyEmailSettings, findCompanyEmailSettings, uploadImage} from "../services/EmpresaServices";


interface EmpresaState {
  company: Companies;
  companiesEmailSettings : CompaniesEmailSettings
  respuesta : Response
  findCompany:  (companyId: number) => Promise<Companies>
  findCompanyEmailSettings:  (companyId: number) => Promise<CompaniesEmailSettings>
  saveCompany:  (data: Companies) => Promise<Response>
  saveCompanyEmailSettingsStore:  (data: CompaniesEmailSettings) => Promise<Response>
  uploadImageCompany: (file: File, companyId: number, type: string) => Promise<Response>;
  resetEmpresa: () => void;
  setRespuestaNull : () => void;
}

const initialEmpresa: Companies = {
  companyId: null,
  companyCode: "",
  companyName: "",
  address: "",
  cities: {
    cityId: "",
    cityName: "",
    dianCode: "",
    states: {
      statesPK: {
        countryId: "",
        stateId: ""
      },
      name: "",
      dianCode: "",
      displayOrder: 0
    }
  },
  contactName: "",
  contactPhone: "",
  description: "",
  websiteUrl: "",
  logoUrl: "",
  profileImageUrl: "",
  status: "",
  businessCategoryId: 0,
  icon: null,
  defaultCurrency: "",
  updatedAt: new Date(),
  updatedBy: 0,  
};

const initialCompaniesEmailSettings: CompaniesEmailSettings = {
  emailSettingsId: null,
  companyId: 0,
  fromName: "",
  fromEmail: "",
  smtpHost: "",
  smtpPort: 0,
  smtpUser: "",
  smtpPassword: "",
  useTls: false,
  status: "",
  updatedAt: new Date(),
  updatedBy: 0
};

export const useEmpresaStore = create<EmpresaState>((set) => ({

    company: initialEmpresa,

    companiesEmailSettings : initialCompaniesEmailSettings,

    respuesta : null,


    findCompany: async (companyId) => {
             
      const company : Companies = await findCompany(companyId)
      
      set(() => ({
        company : company
      }))

      return company
    }, 

    findCompanyEmailSettings: async (companyId) => {
             
      const companiesEmailSettings : CompaniesEmailSettings = await findCompanyEmailSettings(companyId)
      
      set(() => ({
        companiesEmailSettings : companiesEmailSettings
      }))

      return companiesEmailSettings
    },

    saveCompany: async (data) => {
      const now = new Date(); // Fecha actual del sistema
    
      const dataConFecha = {
        ...data,
        updatedAt: now
      };

      const resp: Response = await saveCompany(dataConFecha);
    
      set((state) => ({
        company: {
          ...state.company,
          ...dataConFecha
        },
        respuesta: resp
      }));
    
      return resp;
    },
   
    saveCompanyEmailSettingsStore: async (data) => {
      const now = new Date(); // Fecha actual del sistema
    
      const dataConFecha = {
        ...data,
        updatedAt: now
      };

      const resp: Response = await saveCompanyEmailSettings(dataConFecha);
    
      set((state) => ({
        companiesEmailSettings: {
          ...state.companiesEmailSettings,
          ...dataConFecha
        },
        respuesta: resp
      }));
    
      return resp;
    },

    uploadImageCompany: async (file: File, companyId: number, type: string) => {

      const resp: Response = await uploadImage(file, companyId, type);
      /*set((state) => ({
        respuesta: resp
      }));*/
      return resp;
    },

    resetEmpresa: () => set({ company: initialEmpresa }),

    setRespuestaNull : () => set({respuesta : null})


}));