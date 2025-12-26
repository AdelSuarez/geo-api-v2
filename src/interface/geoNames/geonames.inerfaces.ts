// Para hacer estas interfaces use https://app.quicktype.io/
// Hice una consulta al geonames, copie todo el json y tome
// la interfaz que me proporciono la pagina
// de esta manera en mis interfaces propias puedo tener los datos
// de forma mas robusta

// ! No se modifica este archivo

export interface City {
  timezone: Timezone;
  bbox: Bbox;
  asciiName: string;
  astergdem: number;
  countryId: string;
  fcl: string;
  srtm3: number;
  score: number;
  countryCode: string;
  lat: string;
  fcode: string;
  continentCode: string;
  adminCode1: string;
  lng: string;
  geonameId: number;
  toponymName: string;
  population: number;
  adminName5: string;
  adminName4: string;
  adminName3: string;
  alternateNames: AlternateName[];
  adminName2: string;
  name: string;
  fclName: string;
  countryName: string;
  fcodeName: string;
  adminName1: string;
}

export interface AlternateName {
  isPreferredName?: boolean;
  name: string;
  lang: string;
}

export interface Bbox {
  east: number;
  south: number;
  north: number;
  west: number;
  accuracyLevel: number;
}

export interface Timezone {
  gmtOffset: number;
  timeZoneId: string;
  dstOffset: number;
}
