import { Request, Response } from "express";
import { WorldBankService } from "../services/worldbank.service";

const service = new WorldBankService();

export const getPopulation = async (req: Request, res: Response) => {
  const { countryCode } = req.params;

  if (!countryCode) {
    return res
      .status(400)
      .json({ message: "El countryCode es requerido (Ej: CL)" });
  }

  try {
    const data = await service.getPopulationByCountry(countryCode);

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

export const getHistoryPopulations = async (req: Request, res: Response) => {
  try {
    const populations = await service.getAllSavedPopulation();
    return res.status(200).json(populations);
  } catch (error) {
    return res.status(500).json({
      message: "Error interno al obtener el historial de la poblacion",
    });
  }
};

export const deleltePopulation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "se requiere el ID de la poblacion" });
    }

    const deleted = await service.deleltePopulation(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Poblacion no encontrada en populations MondoDB" });
    }

    return res.status(200).json({
      message: "Poblacion eliminada del historial correctamente",
      data: { name: deleted.name, id: deleted.id },
    });

    // const deleted = await servic
  } catch (error) {
    return res.status(500).json({ message: "Erro interno del servidor" });
  }
};

// export const updatePopulation = async (req: Request, res: Response) => {
//   try {
//   } catch (error) {
//     return res.status(500).json({ message: "Error interno al actualizar" });
//   }
// };
