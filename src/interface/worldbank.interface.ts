import { DataElement } from "./worldBank/worldbank.interface";
// // Lo que devolveremos al cliente (limpio)
// export interface PopulationResponse {
//   countryCode: string;
//   countryName: string;
//   population: number;
//   year: string;
// }

// // Estructura interna para tipar la respuesta "rara" del Banco Mundial
// export interface WorldBankRecord {
//   indicator: { id: string; value: string };
//   country: { id: string; value: string };
//   countryiso3code: string;
//   date: string;
//   value: number | null;
// }

interface Male {
  date: string;
  value: number;
}
interface Female {
  date: string;
  value: number;
}

interface PopulationGrowth {
  date: string;
  value: number;
}

interface LifeExpectancy {
  date: string;
  value: number;
}

interface TotalPopulation {
  date: string;
  value: number;
}

interface WorldBank {
  id: string;
  name: string;
  countryiso3code: string;
  totalPopulation: TotalPopulation;
  lifeExpectance: LifeExpectancy;
  populationGrowth: PopulationGrowth;
  male: Male;
  female: Female;
}

export function getWorldBank(
  popData: DataElement,
  lifeData: DataElement,
  growData: DataElement,
  maleData: DataElement,
  femaleData: DataElement
): WorldBank {
  return {
    id: popData.country.id,
    name: popData.country.value,
    countryiso3code: popData.countryiso3code,
    totalPopulation: {
      date: popData.date,
      value: popData.value,
    },
    lifeExpectance: {
      date: lifeData.date,
      value: lifeData.value,
    },
    populationGrowth: {
      date: growData.date,
      value: growData.value,
    },
    male: {
      date: maleData.date,
      value: maleData.value,
    },
    female: {
      date: femaleData.date,
      value: femaleData.value,
    },
  };
}
