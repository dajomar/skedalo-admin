import { delay } from "@/helpers/helpers";
import { listAppointmentById } from "@/services/AppointmentsServices";
import type { Appointment } from "@/types";
import { useEffect, useState } from "react"

type UseAppointmentReturn = {
  appointment: Appointment | null;
  loading: boolean;
};

export const useAppointmentById = (appointmentId:number):UseAppointmentReturn => {

    const [ appointment, setAppointment ] = useState<Appointment | null>(null); 
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBranch = async () => {
          setLoading(true); 

          
          
          try{
            const data = await listAppointmentById(appointmentId);
            setAppointment(data); 
            
            
          }catch(error){
            console.error( "Error getting appointment by id => ", error ); 
          }finally {
            setLoading(false); // al finalizar
          }
          
        }
        fetchBranch(); 
      },[appointmentId])


    return { appointment, loading };
}