import { Request, Response } from "express";
import { WorldBankService } from "../services/worldbank.service";

const wbService = new WorldBankService();

export const getPopulation = async (req: Request, res: Response) => {
  const { countryCode } = req.params;

  if (!countryCode) {
    return res
      .status(400)
      .json({ message: "El countryCode es requerido (Ej: CL)" });
  }

  try {
    const data = await wbService.getPopulationByCountry(countryCode);

    if (!data) {
      return res.status(404).json({
        message: `No se encontraron datos para el código: ${countryCode}`,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
