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
