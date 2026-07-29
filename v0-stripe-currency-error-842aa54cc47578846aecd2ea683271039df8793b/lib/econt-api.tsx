// lib/econt-api.ts

// Econt API Interfaces
export interface EcontCity {
  id: string
  postCode: string
  name: string
  nameEn: string
  type?: string // 'гр.' or 'с.'
  id_zone?: string
  region?: string
  region_en?: string
  id_country?: string
  id_office?: string
  service_days?: {
    day1: string
    day2: string
    day3: string
    day4: string
    day5: string
    day6: string
    day7: string
  }
  updated_time?: string
  hub_code?: string
  hub_name?: string
  hub_name_en?: string
  courier_request_begin_time?: string
  courier_request_begin_time_saturday?: string
  courier_request_end_time?: string
  courier_request_end_time_saturday?: string
  attach_offices?: any // Complex structure, can be detailed if needed
  phoneCode?: string
  location: {
    latitude: number
    longitude: number
  }
  expressCityDeliveries?: boolean
  // Added fields based on API response construction
  regionName: string
  regionNameEn: string
  country: {
    id: string
    code: string
    code3: string
    name: string
    nameEn: string
    isEu: boolean
  }
}

export interface EcontOffice {
  id: string
  name: string
  nameEn: string
  officeCode: string
  isMachine: boolean
  isDrive: boolean
  cityId: string
  postCode: string
  cityName: string
  cityNameEn: string
  location: {
    latitude: number
    longitude: number
  }
  address: string // Combined address string
  addressDetails?: {
    // Detailed address breakdown
    id_quarter?: string
    quarter_name?: string
    id_street?: string
    street_name?: string
    num?: string
    bl?: string
    vh?: string
    et?: string
    ap?: string
    other?: string
  }
  phone: string
  email: string
  workBegin: string
  workEnd: string
  workBeginSaturday: string | null
  workEndSaturday: string | null
  timePriority?: string
  updatedTime?: string
  hubCode?: string
  hubName?: string
  hubNameEn?: string
  type?: string // This might be redundant with isMachine/isDrive, but keeping for flexibility
  cardPayment?: boolean
  eurobankPayment?: boolean
  // Derived property for UI display
  workingTimeDescription?: string
}

// Econt API Configuration
export const ECONT_CONFIG = {
  // Production endpoints - ALWAYS USE HTTPS
  PRODUCTION: {
    PARCEL_IMPORT: "https://www.econt.com/e-econt/xml_parcel_import2.php",
    SERVICE_TOOL: "https://www.econt.com/e-econt/xml_service_tool.php",
  },
  // Test endpoints - ALWAYS USE HTTPS
  TEST: {
    PARCEL_IMPORT: "https://demo.econt.com/e-econt/xml_parcel_import2.php",
    SERVICE_TOOL: "https://demo.econt.com/e-econt/xml_service_tool.php",
  },
  // Test credentials (as provided in documentation)
  TEST_CREDENTIALS: {
    username: "iasp-dev",
    password: "1Asp-dev",
  },
}

// The actual fetch functions will now be implemented in API route handlers
// to proxy requests and handle XML communication.
