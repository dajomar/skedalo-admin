 import type { Response, Resources, ResourcesServicesDTO, ResourcesServices } from './../types/index';
 import { create } from "zustand";
 import { listResourcesByBranch, listResourcesByCompany, 
         saveResource, saveResourceServices, listByBranchAndResource, 
         uploadResourcePhoto} from "../services/ResourcesServices";
 
export type ResourcesState = {
    resources : Resources[]
    resourcesServices : ResourcesServices[]
    listResourcesByBranch : (branchId : number) => Promise<void>
    listResourcesByCompany : (companyId : number) => Promise<void>
    listByBranchAndResource : (branchId : number, resourceId: number) => Promise<void>
    saveResource : (resource: Resources) => Promise<Response>
    saveResourceServices : (resourcesServicesDTO : ResourcesServicesDTO) => Promise<Response>
    uploadResourcePhoto  : (file: File, resourceId: number) => Promise<Response>
    cleanResourcesServices : () => void
}

export const useResourcesStore = create<ResourcesState>((set, get) => ({
    
    resources: [],

    resourcesServices: [],

    listResourcesByBranch: async (branchId) => {
    
    const listResources : Resources[] = await listResourcesByBranch(branchId)

    set(() => ({
        resources: listResources
    }))

    },

    listResourcesByCompany: async (companyId) => {
    
        const listResources : Resources[] = await listResourcesByCompany(companyId)
    
        set(() => ({
            resources: listResources
        }))
    
    },

    listByBranchAndResource: async (branchId, resourceId) => {

        const resourcesServs : ResourcesServices[]  = await listByBranchAndResource(branchId, resourceId);
        set(() => ({
            resourcesServices: resourcesServs
        }));

    },

    saveResource: async (resource:any) => {

        const response : Response = await saveResource(resource);
    
        if (response && response.dataNumber1) {
            const savedResourceId = response.dataNumber1;
    
            // Clonar el objeto enviado y agregar el ID si era nuevo
            const updatedResource: Resources = {
            ...resource,
            resourceId: savedResourceId
            };
    
            const currentResources = get().resources;
            const index = currentResources.findIndex(res => res.resourceId === savedResourceId);
    
            let updatedResources;
            if (index !== -1) {
            // Actualizar existente
            updatedResources = [...currentResources];
            updatedResources[index] = updatedResource;
            } else {
            // Agregar nuevo
            updatedResources = [...currentResources, updatedResource];
            }
    
            set(() => ({
            resources: updatedResources
            }));
        }
    
        return response;
    },

    saveResourceServices: async (resourcesServicesDTO) => {
    
        const response : Response = await saveResourceServices(resourcesServicesDTO);
    
        if (response && response.dataNumber1) {
            const savedResourceId = response.dataNumber1;
    
            // Clonar el objeto enviado y agregar el ID si era nuevo
            const updatedResource: Resources = {
            ...resourcesServicesDTO.resource,
            resourceId: savedResourceId
            };
    
            const currentResources = get().resources;
            const index = currentResources.findIndex(res => res.resourceId === savedResourceId);
    
            let updatedResources;
            if (index !== -1) {
            // Actualizar existente
            updatedResources = [...currentResources];
            updatedResources[index] = updatedResource;
            } else {
            // Agregar nuevo
            updatedResources = [...currentResources, updatedResource];
            }
    
            set(() => ({
            resources: updatedResources
            }));
        }        

        return response;
    },

    uploadResourcePhoto: async (file, resourceId) => {

        const response : Response = await uploadResourcePhoto(file, resourceId);

        if (response && response.messageId === "TR000") {
            const newPhotoUrl = response.dataText1;
        
            set(state => ({
                resources: state.resources.map(r =>
                    r.resourceId === resourceId
                        ? { ...r, photoUrl: newPhotoUrl }
                        : r
                )
            }));
        }

        return response;
        
    },

    cleanResourcesServices: () => {
        set(() => ({
            resourcesServices: []
        }));
    }

}));
