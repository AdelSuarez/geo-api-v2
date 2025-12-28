// Para hacer estas interfaces use https://app.quicktype.io/
// Hice una consulta al geonames, copie todo el json y tome
// la interfaz que me proporciono la pagina
// de esta manera en mis interfaces propias puedo tener los datos
// de forma mas robusta

// ! No se modifica este archivo

export interface DataElement {
  indicator: Country;
  country: Country;
  countryiso3code: string;
  date: string;
  value: number;
  unit: string;
  obs_status: string;
  decimal: number;
}

export interface Country {
  id: string;
  value: string;
}
