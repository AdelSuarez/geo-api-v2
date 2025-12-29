import { getWorldBank, WorldBank } from "../interface/worldbank.interface";
import { DataElement } from "../interface/worldBank/worldbank.interface";
import { IPopulationDB, PopulationModel } from "../models/population.model";

export class WorldBankService {
  private readonly INDICATORS = {
    pop: "SP.POP.TOTL", // Poblacion total
    life: "SP.DYN.LE00.IN", // Esperanza de vida
    grow: "SP.POP.GROW", // Crecimiento de la porblacion
    male: "SP.POP.TOTL.MA.IN", // poblacion masculina
    female: "SP.POP.TOTL.FE.IN", // poblacion femenino
  };
  private readonly baseUrl = "https://api.worldbank.org/v2";

  async getPopulationByCountry(code: string) {
    // Normalizamos el código a mayúsculas (la API y DB usan "CL", no "cl")
    const countryCode = code.toUpperCase().trim();

    // Verificamos si ya esta guardado en la bd
    const populationDB = await this._getPopulationFromDB(code);
    if (populationDB) {
      return populationDB;
    }

    // buscar en la api
    try {
      const [popData, lifeData, growData, maleData, femaleData] =
        await Promise.all([
          this._fetchIndicator(countryCode, this.INDICATORS.pop),
          this._fetchIndicator(countryCode, this.INDICATORS.life),
          this._fetchIndicator(countryCode, this.INDICATORS.grow),
          this._fetchIndicator(countryCode, this.INDICATORS.male),
          this._fetchIndicator(countryCode, this.INDICATORS.female),
        ]);

      // Si no tenemos ni siquiera población, cancelamos
      if (!popData) return null;

      // Guarda en mongo
      this._savePopulationInDB(
        code,
        popData,
        lifeData,
        growData,
        maleData,
        femaleData
      );

      return getWorldBank(popData, lifeData, growData, maleData, femaleData);
    } catch (error) {
      console.error("Error crítico en WorldBankService:", error);
      return null;
    }
  }

  private async _fetchIndicator(countryCode: string, indicator: string) {
    const params = new URLSearchParams({
      format: "json",
      date: "2020:2025",
      per_page: "10",
    });

    const url = `${
      this.baseUrl
    }/country/${countryCode}/indicator/${indicator}?${params.toString()}`;

    try {
      const res = await fetch(url);
      if (!res.ok) return null;

      const data = (await res.json()) as any;

      if (Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
        // Buscamos el primero que no sea null
        return data[1].find((item: any) => item.value !== null) || null;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  private async _getPopulationFromDB(code: string) {
    const searchCode = new RegExp(`^${code.trim()}$`, "i");

    try {
      const populationData = await PopulationModel.findOne({
        $or: [
          { id: { $regex: searchCode } },
          { searchName: { $regex: searchCode } },
          { countryiso3code: { $regex: searchCode } },
        ],
      });

      if (populationData) {
        console.log(`Recuperado de Population MongoDB: ${code}`);
        return this._mapPopulationResponse(populationData);
      }

      return null;
    } catch (error) {
      console.log("Error leyendo caché de población, continuando con API...");
      return null;
    }
  }

  private async _savePopulationInDB(
    countryCode: string,
    popData: DataElement,
    lifeData: DataElement,
    growData: DataElement,
    maleData: DataElement,
    femaleData: DataElement
  ) {
    try {
      // Usamos findOneAndUpdate con upsert: true para crear o actualizar si ya existe  await PopulationModel.findOneAndUpdate
      await PopulationModel.create({
        searchName: countryCode,
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
      });
      console.log(`Guardado en MongoDB: ${popData.country.value}`);
    } catch (saveError) {
      console.error("No se pudo guardar en DB:", saveError);
    }
  }

  async getAllSavedPopulation() {
    try {
      const populationsDB = await PopulationModel.find().sort({ _id: -1 });

      return populationsDB.map((populationDB) =>
        this._mapPopulationResponse(populationDB)
      );
    } catch (error) {
      console.error("Error obteniendo historial de poblacion:", error);
      throw new Error("No se pudo obtener el historial de poblacion");
    }
  }

  async deleltePopulation(id: string) {
    try {
      const deletedPopulation = await PopulationModel.findOneAndDelete({
        id: id,
      });

      return deletedPopulation;
    } catch (error) {
      console.error("Error eliminando poblacion:", error);
      throw new Error("No se pudo eliminar la poblacion");
    }
  }

  private _mapPopulationResponse(populationDB: IPopulationDB): WorldBank {
    return {
      id: populationDB.id,
      name: populationDB.name,
      countryiso3code: populationDB.countryiso3code,
      totalPopulation: {
        date: populationDB.totalPopulation?.date,
        value: populationDB.totalPopulation?.value,
      },
      lifeExpectance: {
        date: populationDB.lifeExpectance?.date,
        value: populationDB.lifeExpectance?.value,
      },
      populationGrowth: {
        date: populationDB.populationGrowth?.date,
        value: populationDB.populationGrowth?.value,
      },
      male: {
        date: populationDB.male?.date,
        value: populationDB.male?.value,
      },
      female: {
        date: populationDB.female?.date,
        value: populationDB.female?.value,
      },
    };
  }
}
