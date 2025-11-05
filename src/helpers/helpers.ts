import i18n, { t } from "i18next";

/**
 * 
 * @returns Current time in format "yyyy-mm-dd"
 */
export const getCurrentTimeJavaFormat = ():string => (new Date().toISOString().split("T")[0]); 


/**
 * Change format date from yyyy-mm-dd to dd, month de yyyyy
 * @param dateString date using "yyyy-mm-dd" format
 * @returns 
 */
export const formatDateText = (dateString: string =""):string => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  //const date = new Date(dateString);
  const locale = i18n.language || "es";

  const formatted = new Intl.DateTimeFormat(locale, {
    // weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/**
 * @param date:date
 * @returns Current time in format "yyyy-mm-dd"
 */
export const converTimeJavaFormat = (date:Date):string => (date.toISOString().split("T")[0]); 

/**
 * Formateamos un ojeto {day,month,year} to "yyyy-mm-dd"
 * @param date objeto {day,month,year} (meses comienzan en 0)
 * @returns objeto formateado en string "yyyy-mm-dd"
 */
export const formatDate = (date: { day: number; month: number; year: number }): string => { 
  const { day, month, year } = date;

  // Asegurarse de que el día y mes tengan 2 dígitos
  const dayStr = String(day).padStart(2, "0");
  const monthStr = String(month + 1).padStart(2, "0"); // sumamos 1 al mes

  return `${year}-${monthStr}-${dayStr}`;
}

/**
 * 
 * @returns Current time in 2025-08-22T18:35:34.338Z to send java date
 */
export const getISOString = ():string => (new Date().toISOString())

/**
 * 
 * @param hour:string
 * @returns Fortmatted hour xx:xx 
 */
export const formatAvailableTime = (hour:string = '2999-12-31'):string => hour.substring(0,5);  


/**
 * Return formatted duration string
 * @param minutes 
 * @returns time in format string
 */
export const formatDuration = (minutes: number):string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins} ${t('minutes').toLowerCase()}`;
        if (mins === 0) return `${hours} ${hours === 1 ? t('hour') : t('hours')}`;
        return `${hours} ${hours === 1 ? t('hour') : t('hours')} ${mins} ${t('minutes').toLowerCase()}`;
    };


export const isValidEmail = (email:string):boolean => /\S+@\S+\.\S+/.test(email);

export const isEmpty = ( string:string ):boolean => (string.trim() !== '')


export const generateId = ():string => Math.random().toString(36).substring(2, 9);

export const formatCurrency = (amount:number = 0) => `$${amount.toFixed(2)}`;


export const capitalizeFirstLetter = (text: string = ""): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * 
 * @returns Return URL API 
 */
export const getURLApiServer =  ():string => ( import.meta.env.VITE_API_URL );

/**
 * 
 * @returns Return URL SERVER Backend exp: http://localhost:8080
 */
export const getURLServeBackend = (): string => {

    const url:string = import.meta.env.VITE_API_URL; 

    return `${url.split("/")[0]}//${url.split("/")[2]}`
    //return 'http://localhost:8187';
}

/**
 * 
 * @returns Return URL Iamge Server exp: http://localhost:8080
 */
export const getURLServer = (): string => {

    const url:string = import.meta.env.VITE_IMAGE_URL; 

    return `${url.split("/")[0]}//${url.split("/")[2]}`
}

/**
 * 
 * @returns Return URL Iamge Server para servicio vercel exp: /images/...
 */
export const getURLImagesVercelServer = (path:string | null): string => {

  //const url:string = `${import.meta.env.VITE_IMAGE_URL}/${path?.substring(path?.indexOf("/",7)+1)}`;
  
  return `${path}`;
}




//export const getImagesCompaniesPath = (path:string | null):string => ( `${getURLServer()}${path}` )
export const getImagesCompaniesPath = (path:string | null):string => ( `${path}` )

/**
 * Take all tags using class given and recive the new name 
 * of class to apply all of them 
 * 
 * @param prevClassName 
 * @param newClassName 
 */
export const changeCssClassByClassName = ( prevClassName:string, newClassName:string  ):void => {

    const htmlElement:NodeListOf<Element> = document.querySelectorAll(`.${prevClassName}`);
        
    htmlElement.forEach( key => key.className = newClassName );

} 

  /**
   * Delay simulation
   * @param ms miliseconds  
   * @returns 
   */
  export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/***
 * 
 * Toma un objeto inicial y un arreglo con los atributos a remover
 * returna nuevo arreglo sin los atributos enviados en el parametro keys
 * 
 * @param obj => Objeto inicial del cual se quieren remover los atributos
 * @param keys => array con los atributos a remover
 * @returns nuevo array 
 */
export function omitFieldsFromObject<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> {
    const clone = { ...obj };
    keys.forEach((key) => {
      delete clone[key];
    });
    return clone;
  }

  /**
   * This function extract values of key given from array of objects
   * 
   * @param items array to explore
   * @param key key for get values
   * @returns array with values of key given
   */
export const getKeysFromArray = <T, K extends keyof T>(items: T[] | null | undefined, key: K): T[K][] => {
  if (!items || items.length === 0) return [];
  return items.map(item => item[key]);
};

/**
 * 
 * This function extract some keys from array of objects
 * 
 * @param array Array to explore
 * @param keys keys to include in a new array
 * @returns new array with news keys 
 */

export const getSomeKeysFromArray = <T, K extends keyof T>(
  array: T[],
  keys: K[]
): Pick<T, K>[] => {
  if (!Array.isArray(array) || array.length === 0) return [];
  return array.map(item => {
    const filtered = {} as Pick<T, K>;
    keys.forEach(key => {
      filtered[key] = item[key];
    });
    return filtered;
  });
};

/**
 * This function sum key property values from array of objects
 * 
 * @param items array to explore
 * @param key Key for sum values
 * @returns number with sum of property values
 */
export const sumPropertyFromArray = <T>(items: T[] | null | undefined, key: keyof T): number => {
  if (!items || items.length === 0) return 0;
  
  return items.reduce((total, item) => {
    const value = item[key];
    return total + (typeof value === "number" ? value : 0);
  }, 0);
};

export const getDaysOfWeek = () => {

  return [
    { dayOfWeek:1, nameOfDay: 'sunday'},
    { dayOfWeek:2, nameOfDay: 'monday'},
    { dayOfWeek:3, nameOfDay: 'tuesday'},
    { dayOfWeek:4, nameOfDay: 'wednesday'},
    { dayOfWeek:5, nameOfDay: 'thursday'},
    { dayOfWeek:6, nameOfDay: 'friday'},
    { dayOfWeek:7, nameOfDay: 'saturday'},
  ]

} 