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

export const createIncident = async (req: Request, res: Response) => {
    try {
        // Extraemos los datos del Body (JSON)
        const { type, line, description, stopId } = req.body;

        // validacion de campos
        if (!type || !line || !description) {
            return res.status(400).json({ 
                error: "Faltan campos obligatorios" 
            });
        }

        // Llamamos al servicio
        const savedIncident = await service.reportIncident({
            type,
            line,
            description,
            stopId
        });

        // Retornamos 201 (Created)
        return res.status(201).json({
            message: "Incidente registrado exitosamente",
            incident: savedIncident
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno al guardar el incidente" });
    }
};

export const deleteIncident = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 

        if (!id) {
            return res.status(400).json({ error: "Se requiere el ID del incidente" });
        }

        const deletedItem = await service.deleteIncident(id);

        // Si deletedItem es nulo el id no existe
        if (!deletedItem) {
            return res.status(404).json({ error: "Incidente no encontrado" });
        }

        return res.status(200).json({
            message: "Incidente eliminado correctamente",
            deletedId: deletedItem._id
        });

    } catch (error) {
        return res.status(500).json({ error: "Error al eliminar el incidente" });
    }
};

export const updateIncident = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { type, line, description, stopId } = req.body; // Datos a editar

        if (!id) {
            return res.status(400).json({ error: "Se requiere el ID del incidente" });
        }

        // Llamamos al servicio con los nuevos datos
        const updatedItem = await service.updateIncident(id, {
            type,
            line,
            description,
            stopId
        });

        // Si es nulo no existe el id
        if (!updatedItem) {
            return res.status(404).json({ error: "Incidente no encontrado" });
        }

        return res.status(200).json({
            message: "Incidente actualizado correctamente",
            data: updatedItem
        });

    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar el incidente" });
    }
};
