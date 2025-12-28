import { Request, Response } from "express";
import { GeoNameService } from "../services/geonames.service";

const service = new GeoNameService();

export const getCity = async (req: Request, res: Response) => {
  try {
    const city = req.params.city; // Toma el nombre de la URL (ej: Paris)

    const data = await service.getCityDetails(city);

    if (!data) {
      return res.status(404).json({ error: "Ciudad no encontrada" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error del servidor" });
  }
};

export const getHistoryCity = async (req: Request, res: Response) => {
  try {
    const cities = await service.getAllSavedCities();

    return res.status(200).json(cities);
  } catch (error) {
    return res.status(500).json({
      message: "Error interno al obtener el historial de ciudades",
    });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Recibimos el ID (ej: "3625428")

    if (!id) {
      return res
        .status(400)
        .json({ message: "Se requiere el ID de la ciudad" });
    }

    const deleted = await service.deleteCity(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Ciudad no encontrada en cities MongoDB" });
    }

    return res.status(200).json({
      message: "Ciudad eliminada del historial correctamente",
      data: { name: deleted.name, id: deleted.id },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
