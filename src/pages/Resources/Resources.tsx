import { useAuthStore } from "@/store/authStore";
import { useResourcesStore } from "@/store/resourcesStore";
import { useServicesStore } from "@/store/servicesStore";
import { useSedeStore } from "@/store/useSedeStore";
import type { Resources,ResourcesServices, ResourcesServicesDTO, Services } from "@/types";
import { showAlertError, showAlertInfo, showAlertWarning } from "@/utils/sweetalert2";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";


export const ResourcesPage = () => {
 
 const { t } = useTranslation();
  const { companyId, userId } = useAuthStore();
  const { resources, resourcesServices,listResourcesByCompany, 
          saveResourceServices, listByBranchAndResource, 
          cleanResourcesServices, uploadResourcePhoto } =  useResourcesStore();
  const { sedes, listarSedes } = useSedeStore();
  const { services, listServicesByCompany } = useServicesStore();

  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string>("");

  const initialResource: Resources = {
    resourceId: null,
    //branchId: sedes.length > 0 ? sedes[0].branchId || 0 : 0,
    branchId: 0,
    resourceName: "",
    description: "",
    resourceType: "P",
    maxCapacity: 0,
    email: "",
    phoneNumber: "",
    status: "A",
    photoUrl: "",
    updatedAt: new Date(),
    updatedBy: 0,
  };

  const [formData, setFormData] = useState<Resources>(initialResource);
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Lista temporal de servicios para el recurso
  const [servicesTemp, setServicesTemp] = useState<Services[]>([]);

  useMemo(() => {
    if (resources.length === 0) listResourcesByCompany(companyId);
    if (sedes.length === 0) listarSedes(companyId);
    if (services.length === 0) listServicesByCompany(companyId);
    if (resourcesServices.length > 0) cleanResourcesServices();
    // eslint-disable-next-line
  }, [companyId]);

  /*useEffect(() => {
    // Cuando lleguen los servicios (solo los activos), todos se pondrán inactivos por defecto
    const inactivos = services.filter(srv=> srv.status==="A").map((srv) => ({
      ...srv,
      status: "I",
    }));
    setServicesTemp(inactivos);
  }, [services]);*/

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };


  const itemRef = useRef<HTMLLIElement | null>(null); //especificamos el tipo
  const [maxHeight, setMaxHeight] = useState("200px"); // valor inicial

useEffect(() => {
  if (itemRef.current) {
    const itemHeight = itemRef.current.offsetHeight;
    const margin = 4; // mismo valor que marginBottom
    const totalHeight = (itemHeight * 5) + (margin * 6); 
    setMaxHeight(`${totalHeight}px`);
  }
}, [servicesTemp]);

  // Este efecto se encarga de sincronizar servicesTemp cada vez que
  // cambien los servicios globales o los asociados a un recurso
  useEffect(() => {
    if (services.length === 0) return;

    const actualizados = services.filter(srv=> srv.status==="A").map((srv) => {
      const asociado = resourcesServices.find(
        (rs) => rs.service.serviceId === srv.serviceId && rs.status === "A"
      );
      return {
        ...srv,
        status: asociado ? "A" : "I",
      };
    });

    setServicesTemp(actualizados);
  }, [services, resourcesServices]);

  const handleSelectResource = async (res: Resources) => {
    setFormData(res);
    setSelectedPhotoFile(null);
    setPreviewPhotoUrl(res.photoUrl || "");
    await listByBranchAndResource(res.branchId, res.resourceId || 0);
    setShowModal(true);
  };


  const toggleActive = (id: number) => {
    setServicesTemp((prev) =>
      prev.map((srv) =>
        srv.serviceId === id
          ? { ...srv, status: srv.status === "A" ? "I" : "A" }
          : srv
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      // Construir ResourcesServicesDTO considerando servicios asociados, nuevos y desasociados
      const serviciosDTO: ResourcesServices[] = [];
      const resourceActual = { ...formData, updatedBy: userId, updatedAt: new Date() };

      // Servicios que venían asociados (resourcesServices)
      resourcesServices.forEach((rs) => {
        const tempSrv = servicesTemp.find((s) => s.serviceId === rs.service.serviceId);
        if (tempSrv) {
          if (tempSrv.status === "A") {
            // Sigue activo
            serviciosDTO.push({
              ...rs,
              status: "A",
              resource: resourceActual,
              service: tempSrv,
            });
          } else {
            // Se desasoció
            serviciosDTO.push({
              ...rs,
              status: "I",
              resource: resourceActual,
              service: tempSrv,
            });
          }
        }
      });

      // Servicios nuevos asociados (no estaban en resourcesServices y ahora están activos)
      servicesTemp.forEach((srv) => {
        const yaAsociado = resourcesServices.find((rs) => rs.service.serviceId === srv.serviceId);
        if (!yaAsociado && srv.status === "A") {
          serviciosDTO.push({
            resServId: null,
            branchId: formData.branchId,
            status: "A",
            resource: resourceActual,
            service: srv,
          });
        }
      });

      const resourceDTO: ResourcesServicesDTO = {
        resource: resourceActual,
        services: serviciosDTO,
      };

      const resp = await saveResourceServices(resourceDTO);
      
      if (resp && resp.messageId === "TR000") {

         setFormData({ ...resourceActual, resourceId: resp.dataNumber1 });       
         //showAlertInfo(resp.messageText);
         await listByBranchAndResource(resourceActual.branchId, resp.dataNumber1 || 0);
         await listResourcesByCompany(companyId);
        /*setFormData(initialResource);
         setServicesTemp([]);
         cleanResourcesServices();  */

          if (selectedPhotoFile && (resp.dataNumber1 || resourceActual.resourceId)) {

            const resourceId = resp.dataNumber1 || resourceActual.resourceId;
            const photoResp = await uploadResourcePhoto(selectedPhotoFile, resourceId!);

            if (photoResp && photoResp.messageId === "TR000") {
              showAlertInfo(resp.messageText);
            } else if (photoResp) {
              showAlertWarning(t("photo-upload-error") + " " + photoResp.messageText);
            } else {
              showAlertWarning(t("photo-upload-error"));
            }
          }
          else
             showAlertInfo(resp.messageText);


      } else if (resp) {
        showAlertError(resp.messageText);
      } else {
        showAlertError(t("error-save-resource"));
      }
    }
    setValidated(true);
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData(initialResource);
    setServicesTemp([]);
    cleanResourcesServices();
    setValidated(false);
    setSelectedPhotoFile(null);
    setPreviewPhotoUrl("");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewPhotoUrl(url);
    } else {
      setSelectedPhotoFile(null);
      setPreviewPhotoUrl(formData.photoUrl || "");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setFormData(initialResource);
    setSelectedPhotoFile(null);
    setPreviewPhotoUrl("");
    setServicesTemp([]);
    cleanResourcesServices();
    setShowModal(true);
  };

  // Filter & pagination
  const filteredResources = useMemo(() => {
    return resources.filter(r =>
      (r.resourceName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resources, searchTerm]);

  const totalItems = filteredResources.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
 
 
 
    return (
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="relative w-full sm:w-1/2 md:w-1/3">
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Search resources..."
                type="text"
                value={searchTerm}
                onChange={handleSearch}
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200">
                <span className="material-symbols-outlined text-base mr-2">filter_list</span>
                Filters
              </button>
              <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                <span className="material-symbols-outlined text-base mr-2">add</span>
                Add New Resource
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((r) => (
                  <tr key={r.resourceId ?? Math.random()} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.resourceId}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-900 flex items-center">
                      <img src={r.photoUrl || '/placeholder.png'} alt="photo" className="w-10 h-10 rounded-full mr-3 object-cover" />
                      <div>
                        <div>{r.resourceName}</div>
                        <div className="text-xs text-gray-500">{r.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sedes.find(s => s.branchId === r.branchId)?.branchName || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.resourceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.maxCapacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleSelectResource(r)} className="text-primary hover:text-primary/70 mr-2">
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <label className="mr-2" htmlFor="rows_per_page">Rows per page:</label>
              <select id="rows_per_page" value={itemsPerPage} onChange={handleItemsPerPageChange} className="border border-gray-300 rounded-md py-1 px-2 focus:ring-primary focus:border-primary">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div>
              {/* simple pagination controls (reusing Pagination component if available) */}
              {/* Importing Pagination at top would be ideal; but to avoid adding import here, show simple controls */}
              <div className="inline-flex items-center space-x-2">
                <button disabled={currentPage===1} onClick={() => handlePageChange(Math.max(1, currentPage-1))} className="px-3 py-1 bg-gray-100 rounded-md">Previous</button>
                <div className="px-3 py-1 bg-white border rounded-md">{currentPage} / {totalPages}</div>
                <button disabled={currentPage===totalPages} onClick={() => handlePageChange(Math.min(totalPages, currentPage+1))} className="px-3 py-1 bg-gray-100 rounded-md">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
            <div className="relative w-full max-w-3xl mx-4 bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">{formData.resourceId ? 'Edit Resource' : 'Add New Resource'}</h3>
              </div>
              <form className="p-6" noValidate onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Resource name</label>
                    <input name="resourceName" value={formData.resourceName} onChange={handleInputChange} required className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary ${validated && !formData.resourceName ? 'border-red-500' : ''}`} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                    <select name="branchId" value={formData.branchId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary">
                      <option value={0}>-- Select branch --</option>
                      {sedes.map(s => <option key={s.branchId ?? 0} value={s.branchId ?? 0}>{s.branchName}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select name="resourceType" value={formData.resourceType} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary">
                      <option value="P">Person</option>
                      <option value="L">Location</option>
                      <option value="O">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max capacity</label>
                    <input name="maxCapacity" type="number" value={formData.maxCapacity} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Photo</label>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="mt-1 block w-full" />
                    {previewPhotoUrl && <img src={previewPhotoUrl} alt="preview" className="mt-2 w-24 h-24 object-cover rounded-md" />}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary">
                      <option value="A">Active</option>
                      <option value="I">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" onClick={() => { setShowModal(false); }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
}

export default ResourcesPage;