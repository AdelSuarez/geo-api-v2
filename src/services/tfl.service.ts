// import { XMLParser } from "fast-xml-parser";
import { TRANSIT_API_URL, TRANSIT_APP_KEY } from "../config/envs";
import { TransitRoute,  TransitEta} from "../interface/tfl/tfl.interface";


export class TflService {
  
    async getTransitRoutes(city: string) {

    if (city.toLowerCase() !== "london" && city.toLowerCase() !== "londres") {
      return null;
    }
    
        const params = new URLSearchParams({
            app_key: TRANSIT_APP_KEY || "",
    });

        // const url = `${TRANSIT_API_URL}/Line/Mode/tube/Status?${params.toString()}`;

        // Para mostrar mas informacion de otros medios de transporte
        const url = `${TRANSIT_API_URL}/Line/Mode/tube,overground,dlr,elizabeth-line/Status?${params.toString()}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Fetch error in TFL: ${response.statusText}`);
            }
            const data = await response.json();

            return data.map((line: any) => this._mapToInterface(line));

        } catch (error) {
            console.error("Error in getTransitRoutes:", error);
            throw error;
        }

    }

    async getEta(stopId: string) {
    // Si no hay ID, retornamos array vacío por seguridad
    if (!stopId) return [];

    const params = new URLSearchParams({
      app_key: TRANSIT_APP_KEY || "",
    });

    // Endpoint: /StopPoint/{id}/Arrivals
    const url = `${TRANSIT_API_URL}/StopPoint/${stopId}/Arrivals?${params.toString()}`;

    try {
      const response = await fetch(url);
      
      // Si el ID de la parada está mal, TfL devuelve 404
      if (response.status === 404) {
         console.warn(`StopPoint ID ${stopId} not found.`);
         return [];
      }

      if (!response.ok) {
        throw new Error(`Fetch error in TFL: ${response.statusText}`);
      }

      const data = await response.json();

      // Mapeamos y luego ordenamos por tiempo (el más cercano primero)
      return data
        .map((train: any) => this._mapEtaToInterface(train))
        .sort((a: TransitEta, b: TransitEta) => a.timeToStation - b.timeToStation);

    } catch (error) {
      console.error("Error in getEstimatetArrival:", error);
      throw error;
    }
  }

    private _mapToInterface(line: any): TransitRoute {
    // La API devuelve un array de estados, tomamos el primero (el actual)
    const currentStatus = line.lineStatuses && line.lineStatuses.length > 0 
        ? line.lineStatuses[0] 
        : { statusSeverityDescription: "Unknown", reason: "" };

        return {
            mode: line.modeName, // Ej: "tube"
            route: line.name, // Ej: "Bakerloo"
            status: currentStatus.statusSeverityDescription, // Ej: "Good Service"
            details: currentStatus.reason || "" // Ej: "Minor delays due to..."
        };
    }

    private _mapEtaToInterface(arrival: any): TransitEta {
        return {
            line: arrival.lineName,
            destination: arrival.destinationName,
            platform: arrival.platformName,
            timeToStation: arrival.timeToStation,
            // expectedArrival: arrival.expectedArrival
            expectedArrival: arrival.expectedArrival.toString()
        };
    }

}