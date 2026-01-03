// src/services/report.service.ts
import { ReportModel, IReportDB } from "../models/geoReport.model";

export class ReportService {
  
  /**
   * Crear un nuevo reporte
   */
  async createReport(reportData: any): Promise<IReportDB> {
    const report = new ReportModel(reportData);
    return await report.save();
  }

  /**
   * Obtener reporte por ID
   */
  async getReportById(id: string): Promise<IReportDB | null> {
    return await ReportModel.findById(id);
  }

  /**
   * Obtener reportes cercanos
   */
  async getNearbyReports(latitude: number, longitude: number, radius: number, category?: string): Promise<IReportDB[]> {
    const query: any = {
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: radius
        }
      }
    };

    if (category) {
      query.category = category;
    }

    return await ReportModel.find(query).limit(20);
  }

  /**
   * Obtener todos los reportes (historial)
   */
  async getAllReports(): Promise<IReportDB[]> {
    return await ReportModel.find().sort({ "metadata.createdAt": -1 }).limit(50);
  }

  /**
   * Eliminar reporte
   */
  async deleteReport(id: string): Promise<IReportDB | null> {
    return await ReportModel.findByIdAndDelete(id);
  }

  /**
   * Actualizar reporte
   */
  async updateReport(id: string, updateData: any): Promise<IReportDB | null> {
    return await ReportModel.findByIdAndUpdate(
      id, 
      { 
        ...updateData,
        "metadata.updatedAt": new Date()
      }, 
      { new: true, runValidators: true }
    );
  }
}