

import { ErrorCodes } from "@/components/constants/errorCodes";
import { ErrorMessages } from "@/components/constants/errorMessages";
import { omitFieldsFromObject } from "@/helpers/helpers";
import { axiosAPI } from "@/api/axios";
import type { AppointmentUI, BackendResponse } from "@/types";




export const  createAppointment = async (appointmentUI:AppointmentUI):Promise<BackendResponse> =>  {

    try {
      // const url: string = `/appointments/scheduleAppointment`;
      const url: string = `/scheduleAppointment`;
      
      console.log('Mi reserva ala server')
      console.log(omitFieldsFromObject(appointmentUI,['service','staff']  ));

      const {data} = await axiosAPI<BackendResponse>({ url, data:omitFieldsFromObject(appointmentUI,['service','staff']  ), method: 'post', })
      
      
      if( data.messageId !== ErrorCodes.SUCCESSFUL  ){

        const errorCode  = data.messageId as ErrorCodes; 
        
        const messageError = ErrorMessages[errorCode] ?? ErrorMessages[ErrorCodes.UNKNOW_ERROR]; 

        throw new Error( messageError )

      }


      return data;
      
    } catch (error:any) {
      console.log(error)
      throw Error(error.message || 'Mie error')
    } 
  
  }
  