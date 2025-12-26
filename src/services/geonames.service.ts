import { GEONAMES_API_URL, GEONAMES_USER } from "../config/envs";
import { getGeoCity } from "../interface/geocity.interface";
import { CityModel } from "../models/city.model"; // <--- 1. NUEVO IMPORT

export class GeoNameService {
  async getCityDetails(city: string) {
    // Verificamos en la base de datos primero si se encuentra
    try {
      // Buscamos sin importar mayúsculas/minúsculas
      const cachedCity = await CityModel.findOne({
        name: { $regex: new RegExp(`^${city.trim()}$`, "i") },
      });

      if (cachedCity) {
        console.log(`Recuperado de MongoDB: ${cachedCity.name}`);
        return cachedCity; // retornamos si ya existe en mongo
      }
    } catch (error) {
      console.log("Error en DB, Usando api");
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
      try {
        await CityModel.create({
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

      // Enviamos a la documentacion la informacion ya lista
      return getGeoCity(result);
    } catch (error) {
      console.error("Error en getCityDetails:", error);
      throw error;
    }
  }
}
