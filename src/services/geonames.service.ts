import { GEONAMES_API_URL, GEONAMES_USER } from "../config/envs";
import { CityModel } from "../models/city.model"; // <--- 1. NUEVO IMPORT

export class GeoNameService {
  async getCityDetails(city: string) {
    // --- 2. NUEVO: VERIFICAR SI YA EXISTE EN MONGODB (CACHE) ---
    try {
      // Buscamos sin importar mayúsculas/minúsculas
      const cachedCity = await CityModel.findOne({
        name: { $regex: new RegExp(`^${city.trim()}$`, "i") },
      });

      if (cachedCity) {
        console.log(`⚡ Recuperado de caché (MongoDB): ${cachedCity.name}`);
        return cachedCity; // ¡Retornamos rápido y no gastamos API!
      }
    } catch (error) {
      console.log("Error leyendo caché, intentando con API externa...");
    }
    // ------------------------------------------------------------

    // --- TU CÓDIGO ORIGINAL (INTACTO) ---
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

      const result = data.geonames[0];

      // --- 3. NUEVO: GUARDAR EN MONGODB PARA LA PRÓXIMA ---
      try {
        await CityModel.create({
          name: result.name,
          lat: result.lat,
          lng: result.lng,
          countryName: result.countryName,
          population: result.population,
        });
        console.log(`💾 Guardado en caché (MongoDB): ${result.name}`);
      } catch (saveError) {
        console.error("No se pudo guardar en caché:", saveError);
      }
      // ----------------------------------------------------

      return result;
    } catch (error) {
      console.error("Error en getCityDetails:", error);
      throw error;
    }
  }
}
