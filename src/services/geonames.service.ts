import { GEONAMES_API_URL, GEONAMES_USER } from "../config/envs";
import { GeoCity, getGeoCity } from "../interface/geocity.interface";
import { City } from "../interface/geoNames/geonames.interface";
import { CityModel, ICityDB } from "../models/city.model";

export class GeoNameService {
  async getCityDetails(city: string) {
    // Verificamos en la base de datos primero si se encuentra
    const cityDB = await this._getCityFromDB(city);
    if (cityDB) {
      return cityDB;
    }

    // Consumo de api si no esta en la bd
    const params = new URLSearchParams({
      q: city,
      maxRows: "1",
      username: GEONAMES_USER || "",
      style: "FULL",
    });

    const url = `${GEONAMES_API_URL}/searchJSON?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as any;

      // Si no trea un status 200 lanza este error
      if (data.status) {
        console.error("GeoNames Error:", data.status.message);
        throw new Error(`GeoNames Error: ${data.status.message}`);
      }

      if (!data.geonames || data.geonames.length === 0) {
        console.log("No se encontraron resultados para:", city);
        return null;
      }

      // tomamos solo el primer valor
      const result = data.geonames[0];

      // Guardamos en la basde de datos de mongo
      this._saveCityInDB(city, result);

      // Enviamos a la documentacion la informacion ya lista
      return getGeoCity(result);
    } catch (error) {
      console.error("Error en getCityDetails:", error);
      throw error;
    }
  }

  private async _saveCityInDB(city: string, result: City) {
    try {
      await CityModel.create({
        searchName: city,
        id: result.countryId,
        name: result.name,
        latitude: result.lat,
        longitude: result.lng,
        bounding: result.bbox,
        timezone: result.timezone,
      });
      console.log(`Guardado en MongoDB: ${result.name}`);
    } catch (saveError) {
      console.error("No se pudo guardar en MongoDB:", saveError);
    }
  }

  private async _getCityFromDB(city: string) {
    // Realizamos un formateo para poder comparar bien en la base de datos
    const searchNameCity = new RegExp(`^${city.trim()}$`, "i");

    try {
      //buscamos si no esta esta por el nombre de la busqueda o el nombre que la api
      const cityDB = await CityModel.findOne({
        $or: [
          { searchName: { $regex: searchNameCity } },
          { name: { $regex: searchNameCity } },
        ],
      });

      // Retornamos la misma estructura que retorna la api para mantener consistencia

      if (cityDB) {
        console.log(`Recuperado de cities MongoDB: ${cityDB.name}`);
        return this._mapCityResponse(cityDB);
      }

      return null;
    } catch (error) {
      console.log("Error en DB, Usando api");
      return null;
    }
  }

  async getAllSavedCities() {
    try {
      // .sort({ _id: -1 }) hace que salgan las ultimas agregadas primero
      const citiesDB = await CityModel.find().sort({ _id: -1 });

      // Mapeamos los datos para devolver la estructura limpia (igual que _getCityFromDB)
      return citiesDB.map((cityDB) => this._mapCityResponse(cityDB));
    } catch (error) {
      console.error("Error obteniendo historial de ciudades:", error);
      throw new Error("No se pudo obtener el historial de ciudades");
    }
  }

  async deleteCity(id: string) {
    try {
      // Usamos findOneAndDelete buscando por el campo 'id' que definiste en el Schema
      const deletedCity = await CityModel.findOneAndDelete({ id: id });
      return deletedCity;
    } catch (error) {
      console.error("Error eliminando ciudad:", error);
      throw new Error("No se pudo eliminar la ciudad");
    }
  }

  async aupdateCity(id: string, updateData: any) {
    const updatedCity = await CityModel.findOneAndUpdate(
      { id: id },
      updateData,
      { new: true }
    );

    if (!updatedCity) return null;

    return this._mapCityResponse(updatedCity);
  }

  private _mapCityResponse(cityDB: ICityDB): GeoCity {
    return {
      id: cityDB.id,
      name: cityDB.name,
      longitude: cityDB.longitude,
      latitude: cityDB.latitude,
      bounding: cityDB.bounding
        ? {
            east: cityDB.bounding.east,
            south: cityDB.bounding.south,
            north: cityDB.bounding.north,
            west: cityDB.bounding.west,
            accuracyLevel: cityDB.bounding.accuracyLevel,
          }
        : undefined,
      timezone:
        cityDB.timezone && cityDB.timezone.timeZoneId
          ? {
              gmtOffset: cityDB.timezone.gmtOffset,
              timeZoneId: cityDB.timezone.timeZoneId,
              dstOffset: cityDB.timezone.dstOffset,
            }
          : undefined,
    };
  }
}
