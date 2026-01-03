// import { XMLParser } from "fast-xml-parser";
import { TRANSIT_API_URL, TRANSIT_APP_KEY } from "../config/envs";
import { TransitRoute } from "../interface/tfl/tfl.interface";


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
}