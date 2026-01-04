import { Request, Response } from "express";
import { TflService } from "../services/tfl.service";

const service = new TflService();

export const getTflStatus = async (req: Request, res: Response) => {
    
    try {

        const city = req.params.city; // Toma el nombre de la URL (ej: London)

        if (!city) {
            return res.status(400).json({ error: "Se requiere el nombre de la ciudad" });
        }

        const data = await service.getTransitRoutes(city);
        
        if (!data) {
            return res.status(404).json({ error: "Ciudad no encontrada" });
        }

        return res.status(200).json(data);


    } catch (error) {
        return res.status(500).json({ error: "Error del servidor" });
    }
};

export const getTflEta = async (req: Request, res: Response) => {
    
    try {
        //  console.log("Query:", req.query);
        // const stopId = req.query.stop_Id as string; // Toma el ID de la parada de la URL

        const { stop_id } = req.query;
        

        if (!stop_id || typeof stop_id !== "string") {
            return res.status(400).json({ error: "Se requiere el ID de la parada" });
        }

        const data = await service.getEta(stop_id);

        // Para mostrar solo el siguiente tren

        // const nextUnit = data.length > 0 ? data[0] : null;

        // if (!nextUnit) {
        //      return res.status(404).json({ message: "No hay trenes proximos" });
        // }

        return res.status(200).json(data);

        // return res.status(200).json(nextUnit);
        
    } catch (error) {
        return res.status(500).json({ error: "Error del servidor" });
    }
};
