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

