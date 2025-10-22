
import i18n from '@/locales/i18n';
import Swal from 'sweetalert2';

/*import { AppointmentProjection, Response } from '../types';
import { cancelAppointment } from '../services/AppointmentsServices';*/


export const showAlertInfo = (textoInfo : string) :void => {

    Swal.fire({
        icon: 'success',
        //title: textoInfo,
        text: textoInfo,
        confirmButtonText: 'Aceptar'
      });
    
}

export const showAlertWarning = (textoAdvertencia : string) :void => {

    Swal.fire({
        icon: 'warning',
        title: '¡Atención!',
        text: textoAdvertencia,
        confirmButtonText: 'Aceptar'
      });
    
}

export const showAlertError = (textoError : string) :void => {

    Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: textoError,
        confirmButtonText: 'Aceptar'
      });
    
}

export const showAlertSessionExpired = () : void => {
  Swal.fire({
    icon: "warning",
    title: i18n.t("error.sessionExpiredTitle"), // "Sesión expirada"
    text: i18n.t("error.sessionExpiredMessage"), //"Su sesión ha expirado. Por favor, inicie sesión de nuevo.",
    showConfirmButton: false,   // no mostramos botón "OK"
    timer: 5000,                // dura 5 segundos
    timerProgressBar: true,     // barra de progreso visual
    willClose: () => {
      // cuando cierre la alerta (después de 5s), redirige
      window.location.href = "/login";
    },
  });
}

export const showAlertInfoWithTime = (titleText : string) : void => {

    Swal.fire({
        position: "top-end",
        icon: "success",
        title: titleText,
        showConfirmButton: false,
        timer: 1500
      });
}


export const showAlertQuestion = () :void => {

    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, bórralo',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            '¡Borrado!',
            'Tu archivo ha sido eliminado.',
            'success'
          );
        }
      });
    
}

export const confirmCanceling = async (): Promise<boolean> => {

  const result = await Swal.fire({
    title: i18n.t("areYouSure"), // "¿Estás seguro?",
    text: i18n.t("youWon'tBeAbleToRevertThis"), // "¡No podrás revertir esto!"
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: i18n.t("yesCancelIt"), // 'Sí, cancélalo'
    cancelButtonText: i18n.t("close")
  });

  return result.isConfirmed; // devuelve true o false
};

/*
// Detectar idioma actual de i18n
const lang = i18n.language;

// Mapear idiomas soportados
const localeMap: Record<string, string> = {
  en: "en-US", // Inglés
  es: "es-ES", // Español
  fr: "fr-FR", // Francés
};

const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));

    // Usar el idioma actual o fallback en-US
    const locale = localeMap[lang] || "en-US";      

    return date.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
 };

export const showAlertConfirmOrCancel = (appointment : AppointmentProjection,
                                         t: (key: string) => string  ) :void => {  

    Swal.fire({
      title: "¿Quieres confirmar o cancelar la cita?",
      icon: "question",
      html: `
          <b> Cliente: </b> ${appointment.client}
          <br/>
          <b> Servicio: </b> ${appointment.serviceName}
          <br/>
          <b> Hora: </b> ${formatTime(appointment.startTime)}
        `,      
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      denyButtonText: `Cancelar`,
      cancelButtonText: "Cerrar",
    }).then(async (result) => {
      if (result.isConfirmed) {    
           Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
          const resultConfirm = await confirmCanceling();
           if (resultConfirm) {
            // Llamar a la API para cancelar la cita
            const resp : Response = await cancelAppointment(appointment.appointmentId);
            if (resp && resp.messageId === "TR000") {
              Swal.fire("Cita cancelada", "", "success");
            } else if (resp) {
              showAlertError(resp.messageText);
            } else {
              showAlertError(t("error-save-service"));
            }   
          }   
      }
    });
      
}*/