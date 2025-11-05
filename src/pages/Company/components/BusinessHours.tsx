import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "react-i18next";

export const BusinessHours = () => {
  const { t } = useTranslation();
  const { companyId } = useAuthStore();
  

  

return (

     <div className="md:col-span-2 pt-6">
                                    <h4 className="text-xl font-bold text-gray-800 mb-4">Business Hours</h4>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Monday</label></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="monday-open" type="time" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="monday-close" type="time" /></div>
                                            <div className="col-span-1 flex items-center"><input
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                id="monday-closed" name="monday-closed" type="checkbox" /><label
                                                    className="ml-2 block text-sm text-gray-900"
                                                    htmlFor="monday-closed">Closed</label></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Tuesday</label>
                                            </div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="tuesday-open" type="time" value="09:00" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="tuesday-close" type="time" value="17:00" /></div>
                                            <div className="col-span-1"></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Wednesday</label>
                                            </div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="wednesday-open" type="time" value="09:00" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="wednesday-close" type="time" value="17:00" /></div>
                                            <div className="col-span-1"></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Thursday</label>
                                            </div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="thursday-open" type="time" value="09:00" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="thursday-close" type="time" value="17:00" /></div>
                                            <div className="col-span-1"></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Friday</label></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="friday-open" type="time" value="09:00" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="friday-close" type="time" value="17:00" /></div>
                                            <div className="col-span-1"></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Saturday</label>
                                            </div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="saturday-open" type="time" value="10:00" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="saturday-close" type="time" value="15:00" /></div>
                                            <div className="col-span-1"></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                            <div className="col-span-1"><label
                                                className="block text-sm font-medium text-gray-700">Sunday</label></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="sunday-open" type="time" /></div>
                                            <div className="col-span-1"><input
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                name="sunday-close" type="time" /></div>
                                            <div className="col-span-1 flex items-center"><input
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                id="sunday-closed" name="sunday-closed" type="checkbox" /><label
                                                    className="ml-2 block text-sm text-gray-900"
                                                    htmlFor="sunday-closed">Closed</label></div>
                                        </div>
                                    </div>
                                </div> 


  );
}