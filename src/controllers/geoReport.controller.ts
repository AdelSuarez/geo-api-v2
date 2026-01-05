import { Request, Response } from "express";
import { ReportService } from "../services/geoReport.service";

const service = new ReportService();

export const createReport = async (req: Request, res: Response) => {
  try {
    console.log(" Controller: Recibiendo solicitud POST /geo/report");

    // 1. Extraer datos del request 
    const {
      title,
      description,
      category,
      latitude,
      longitude,
      city,
      country,
      address,
      priority,
      mediaUrls,
      userId
    } = req.body;

    // 2. Validación básica de presencia 
    if (!title || !description || !category || !latitude || !longitude || !city || !country) {
      console.log(" Controller: Faltan campos requeridos");
      return res.status(400).json({ 
        success: false,
        message: "Faltan campos requeridos" 
      });
    }

    // 3. Pasar datos CRUDOS al service 
    console.log(" Controller: Pasando datos al service...");
    const savedReport = await service.createReport({
      title,
      description,
      category,
      latitude,
      longitude,
      city,
      country,
      address,
      priority,
      mediaUrls,
      userId,
      // Metadata que solo el controller puede obtener
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"]
    });

    // 4. Responder 
    console.log(` Controller: Reporte creado. ID: ${savedReport._id}`);
    return res.status(201).json({
      success: true,
      message: "Reporte creado exitosamente",
      data: {
        id: savedReport._id,
        title: savedReport.title,
        trackingCode: savedReport.trackingCode,
        status: savedReport.status
      }
    });

  } catch (error: any) {
    console.error(" Controller: Error en createReport:", error);

    // 5. Manejo de errores HTTP 
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Error de validación en los datos",
        errors: error.errors ? Object.values(error.errors).map((err: any) => ({
          field: err.path,
          message: err.message,
          value: err.value
        })) : error.message
      });
    }

    return res.status(500).json({ 
      success: false,
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: "Se requiere el ID del reporte" 
      });
    }

    const report = await service.getReportById(id);

    if (!report) {
      return res.status(404).json({ 
        success: false,
        message: "Reporte no encontrado" 
      });
    }

    return res.status(200).json({
      success: true,
      data: report
    });

  } catch (error: any) {
    console.error("Error al obtener reporte:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error interno del servidor" 
    });
  }
};

export const getHistoryReports = async (req: Request, res: Response) => {
  try {
    const reports = await service.getAllReports();

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });

  } catch (error: any) {
    console.error("Error al obtener historial de reportes:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error interno del servidor" 
    });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: "Se requiere el ID del reporte" 
      });
    }

    const deleted = await service.deleteReport(id);

    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        message: "Reporte no encontrado" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reporte eliminado correctamente",
      data: { 
        id: deleted._id, 
        title: deleted.title 
      }
    });

  } catch (error: any) {
    console.error("Error al eliminar reporte:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error interno del servidor" 
    });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: "Se requiere el ID del reporte" 
      });
    }

    const updated = await service.updateReport(id, body);

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: "Reporte no encontrado" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reporte actualizado correctamente",
      data: updated
    });

  } catch (error: any) {
    console.error("Error al actualizar reporte:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error interno del servidor" 
    });
  }
};