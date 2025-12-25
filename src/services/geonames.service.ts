import { GEONAMES_API_URL, GEONAMES_USER } from "../config/envs";

export class GeoNameService {
  async getCityDetails(city: string) {
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

      return data.geonames[0];
    } catch (error) {
      console.error("Error en getCityDetails:", error);
      throw error;
    }
  }
}
