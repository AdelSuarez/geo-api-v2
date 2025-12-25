import { Request, Response } from "express";
import { GeoNameService } from "../services/geonames.service";

const servicio = new GeoNameService();

export const getCity = async (req: Request, res: Response) => {
  try {
    const ciudad = req.params.city; // Toma el nombre de la URL (ej: Paris)

    const datos = await servicio.getCityDetails(ciudad);

    if (!datos) {
      return res.status(404).json({ error: "Ciudad no encontrada" });
    }

    return res.status(200).json(datos);
  } catch (error) {
    return res.status(500).json({ error: "Error del servidor" });
  }
};
