// src/controllers/geoReport.controller.ts
import { Request, Response } from "express";
import { ReportService } from "../services/geoReport.service";

const service = new ReportService();

export const createReport = async (req: Request, res: Response) => {
  try {
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

    console.log("📥 Datos recibidos:", req.body); // <-- Añade esto

    // Validación básica
    if (!title || !description || !category || !latitude || !longitude || !city || !country) {
      return res.status(400).json({ 
        success: false,
        message: "Faltan campos requeridos" 
      });
    }

    const trackingCode = `REP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Preparar datos
    const reportData = {
      title: title.trim(),
      description: description.trim(),
      category,
      location: {
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address: address ? address.trim() : undefined,
        city: city.trim(),
        country: country.trim()
      },
      priority: priority || "medium",
      userId: userId ? userId.trim() : undefined,
      mediaUrls: mediaUrls || [],
      metadata: {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"] || "Desconocido"
      },
      trackingCode: trackingCode
    };

    console.log("📤 Datos procesados:", reportData); // <-- Añade esto

    const savedReport = await service.createReport(reportData);

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
    console.error("❌ Error al crear reporte:", error);
    console.error("📋 Error completo:", JSON.stringify(error, null, 2)); // <-- Añade esto

    // Manejo de errores
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
      error: error.message // <-- Incluye el mensaje completo
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

  } catch (error) {
    console.error("Error al obtener reporte:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error interno del servidor" 
    });
  }
};

export const getNearbyReports = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius = 1000, category } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false,
        message: "Se requieren coordenadas (latitude, longitude)" 
      });
    }

    const reports = await service.getNearbyReports(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      parseInt(radius as string),
      category as string
    );

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });

  } catch (error) {
    console.error("Error al obtener reportes cercanos:", error);
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

  } catch (error) {
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

  } catch (error) {
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

  } catch (error) {
    console.error("Error al actualizar reporte:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error interno del servidor" 
    });
  }
};
