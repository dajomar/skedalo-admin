
export type UsersCompaniesDTO = {
    userId : number
    companyId : number
    companyName : string
    status : string 
    defaultCurrency : string
}

export type UserLogin = {
    userId : number
    user : string
    email : string
    password : string
    accessToken : string
    refreshToken : string
    expiresIn :  number
    usersCompanies : UsersCompaniesDTO[]
}


export type Countries = {
    countryId : string
    countryName :  string 
    isoCode :  string
    displayOrder : number
}

export type StatesPK = {
    countryId : string
    stateId : string
}

export type States = {
    statesPK : StatesPK
    name : string
    dianCode : string
    displayOrder : number
}

export type Cities = {
    cityId : string
    cityName :  string 
    dianCode : string 
    states? : States | null
}

export type BusinessCategories = {
    businessCategoryId : number
    name : string
    description : string  
    icon : string
    slug : string
}

export type Companies = {
    companyId : number | null
    companyCode : string
    companyName :  string
    address : string
    contactName : string
    contactPhone :  string
    icon : string | null
    defaultCurrency : string
    status : string
    cities : Cities
    businessCategoryId : number
    description : string | null
    websiteUrl : string | null
    logoUrl : string | null
    profileImageUrl : string | null
    updatedAt : Date
    updatedBy : number
}

export type CompaniesEmailSettings = {
      emailSettingsId : number | null
      companyId : number
      fromName : string
      fromEmail : string
      smtpHost  : string   
      smtpPort : number
      smtpUser :string
      smtpPassword : string
      useTls : boolean
      status : string
      updatedAt : Date
      updatedBy : number
}

export type Response = {
    messageId : string
    messageText : string
    dataNumber1 : number
    dataNumber2 : number
    dataText1 : string
} | null


export type Branches = {
    branchId : number | null
    branchName : string
    address : string
    phoneNumbers : string
    status : string
    companyId : number
    cities : Cities
    timezone : string
}

export interface Branch {
    branchId:     number;
    branchName:   string;
    address:      string;
    timezone:     string;
    phoneNumbers: string;
    status:       string;
    companyId:    number;
    directions:   string;
    postalCode:   string;
    cities:       Cities;
    images:       ImageBranch[];
}

export interface ImageBranch {
    branchImageId: number;
    branchId:      number;
    imageUrl:      string;
}



export type ServiceCategories = {
  categoryId: number | null
  companyId: number
  name: string
  description?: string
  icon?: string
  color?: string
  status: string
  updatedAt: Date
  updatedBy: number
};

export type Services = {
  serviceId: number | null
  companyId: number
  categoryId: number
  serviceName: string
  description: string
  durationMinutes: number
  price : number  //definido en el backend como BigDecimal (12,2)
  currency: string
  icon?: string  
  status: string
  updatedAt: Date
  updatedBy: number
};

export type Resources = {
  resourceId: number | null
  branchId: number
  userId?: number
  resourceName: string
  description: string
  resourceType: 'P' | 'L' | 'O'  // 'P': Person  'L': Location   'O': Other
  maxCapacity: number
  email?: string
  phoneNumber?: string
  photoUrl : string | null
  status: 'A' | 'I'  
  updatedAt: Date 
  updatedBy: number
};

export type ResourcesServices = {
  resServId: number | null
  branchId: number
  status: 'A' | 'I'
  resource: Resources; 
  service: Services;   
};

export type ResourcesServicesDTO = {
    resource : Resources
    services : ResourcesServices[]
}

export type Schedules = {
  scheduleId: number | null;
  branchId: number;
  resourceId: number;
  dayOfWeek: number;
  startTime: string; // formato "HH:mm:ss"
  endTime: string;   // formato "HH:mm:ss"
  status: string;
}

export type ExceptionReasons = {
  exceptionReasonId: number | null;
  companyId: number;
  description: string;
  reasonType: string;
  status: string;
}

export type ExceptionSchedule = {
  exceptionScheduleId: number | null;
  branchId: number;
  resourceId: number;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  exceptionReasons: {
    exceptionReasonId: number;
  };
}

export type UserPasswordDTO = {
  email: string;
  currentPassword : string;
  newPassword : string;
}

export type UsersDTO = {
  userId: number | null;
  firstName: string;
  lastName: string;
  address?: string;
  cityId: string;
  cityName: string;
  stateId: string;
  stateName: string;
  countryId: string;
  countryName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  roleId: number;
  role: string;
  status: string;
  companies: UsersCompaniesDTO[];
}

export type AppointmentProjection = {
  appointmentId: number;
  branchId: number;
  resourceId: number;
  resourceName: string;
  serviceId: number;
  serviceName: string;
  appointmentDate: string; // LocalDate → ISO string (ej: "2025-07-18")
  startTime: string;       // LocalTime → string (ej: "09:30:00")
  endTime: string;         // LocalTime → string (ej: "10:00:00")
  client: string;
  email: string;
  phoneNumber: string;
  status: string;
  photoUrl: string | null;
};


export interface Appointment {
    appointmentId:         number;
    branchId:              number;
    date:                  string;
    startTime:             string;
    endTime:               string;
    status:                string;
    userId:                number;
    userFirstName:         string;
    userLastName:          string;
    userPhone:             string;
    userEmail:             string;
    resourceId:            number;
    resourceName:          string;
    resourceType:          string;
    totalServicesDuration: number;
    startDateTimeUtc:      Date;
    endDateTimeUtc:        Date;
    services:              ServiceDTO[];
}

export interface ServiceDTO {
    appointmentServId: number;
    appointmentId:     number;
    serviceId:         number;
    serviceName:       string;
    price:             number;
    durationMinutes:   number;
}


  export interface BranchDTO {
    address:         string;
    profileImageUrl: null;
    companyName:     string;
    cityName:        string;
    branchName:      string;
    logoUrl:         string;
    companyId:       number;
    branchId:        number;
    icon:            string;
    description:     string; 
    branchImages:   string | null;
  }