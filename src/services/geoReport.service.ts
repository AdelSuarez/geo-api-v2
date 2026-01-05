import { ReportModel, IReportDB } from "../models/geoReport.model";

export class ReportService {
  
  /**
   * Crear un nuevo reporte 
   */
  async createReport(reportData: any): Promise<IReportDB> {
    try {
      console.log(" Service: Iniciando creación de reporte...");

      // 1. Preparar datos para MongoDB 
      const dataForDB = this._prepareReportForDB(reportData);
      console.log("   Datos preparados para BD:", dataForDB);

      // 2. Guardar en MongoDB 
      console.log(" Service: Guardando en MongoDB...");
      const report = new ReportModel(dataForDB);
      const savedReport = await report.save();
      
      console.log(` Service: Reporte guardado. ID: ${savedReport._id}`);
      return savedReport;
      
    } catch (error) {
      console.error(" Service: Error en createReport:", error);
      throw error;
    }
  }

  /**
   * Obtener reporte por ID 
   */
  async getReportById(id: string): Promise<IReportDB | null> {
    try {
      console.log(` Service: Buscando reporte ID: ${id}`);
      
      // Buscar directamente 
      const report = await ReportModel.findById(id);
      
      if (report) {
        console.log(` Service: Reporte encontrado: ${report.title}`);
        return this._mapReportResponse(report);
      } else {
        console.log(` Service: Reporte no encontrado: ${id}`);
        return null;
      }
      
    } catch (error) {
      console.error(` Service: Error buscando reporte ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener todos los reportes 
   */
  async getAllReports(): Promise<IReportDB[]> {
    try {
      console.log(" Service: Obteniendo todos los reportes...");
      
      // Buscar y ordenar 
      const reports = await ReportModel.find()
        .sort({ createdAt: -1 })
        .limit(50);
      
      console.log(` Service: ${reports.length} reportes obtenidos`);
      
      // Mapear respuesta 
      return reports.map(report => this._mapReportResponse(report));
      
    } catch (error) {
      console.error(" Service: Error obteniendo reportes:", error);
      throw error;
    }
  }

  /**
   * Eliminar reporte - SIGUIENDO EL MISMO PATRÓN
   */
  async deleteReport(id: string): Promise<IReportDB | null> {
    try {
      console.log(` Service: Eliminando reporte ID: ${id}`);
      
      // Eliminar (igual que CityModel.findOneAndDelete)
      const deletedReport = await ReportModel.findByIdAndDelete(id);
      
      if (deletedReport) {
        console.log(` Service: Reporte eliminado: ${deletedReport.title}`);
        return this._mapReportResponse(deletedReport);
      } else {
        console.log(` Service: No se pudo eliminar reporte ${id}`);
        return null;
      }
      
    } catch (error) {
      console.error(` Service: Error eliminando reporte ${id}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar reporte - SIGUIENDO EL MISMO PATRÓN
   */
  async updateReport(id: string, updateData: any): Promise<IReportDB | null> {
    try {
      console.log(` Service: Actualizando reporte ID: ${id}`);
      
      // Actualizar (igual que CityModel.findOneAndUpdate)
      const updatedReport = await ReportModel.findByIdAndUpdate(
        id, 
        { 
          ...updateData,
          updatedAt: new Date(),
          "metadata.updatedAt": new Date()
        }, 
        { new: true, runValidators: true }
      );
      
      if (updatedReport) {
        console.log(` Service: Reporte actualizado: ${updatedReport.title}`);
        return this._mapReportResponse(updatedReport);
      } else {
        console.log(`Service: No se pudo actualizar reporte ${id}`);
        return null;
      }
      
    } catch (error) {
      console.error(` Service: Error actualizando reporte ${id}:`, error);
      throw error;
    }
  }

  /**
   * ============================================
   * MÉTODOS PRIVADOS 
   * ============================================
   */

  /**
   * Preparar datos para MongoDB 
   */
  private _prepareReportForDB(data: any): any {
    // Generar trackingCode (lógica de negocio)
    const trackingCode = `REP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    return {
      title: data.title?.trim(),
      description: data.description?.trim(),
      category: data.category,
      location: {
        type: "Point", // Para GeoJSON
        coordinates: [
          parseFloat(data.longitude),
          parseFloat(data.latitude)
        ],
        address: data.address?.trim(),
        city: data.city?.trim(),
        country: data.country?.trim()
      },
      priority: data.priority || "medium",
      userId: data.userId?.trim(),
      mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
      trackingCode: trackingCode,
      status: "pending",
      metadata: {
        ipAddress: data.ipAddress || "Desconocido",
        userAgent: data.userAgent || "Desconocido",
        submittedAt: new Date()
      }
    };
  }

  /**
   * Mapear respuesta 
   */
private _mapReportResponse(reportDB: IReportDB): any {
  return {
    id: reportDB._id,
    title: reportDB.title,
    description: reportDB.description,
    category: reportDB.category,
    location: {
      coordinates: reportDB.location?.coordinates || [],
      address: reportDB.location?.address,
      city: reportDB.location?.city,
      country: reportDB.location?.country
    },
    priority: reportDB.priority,
    trackingCode: reportDB.trackingCode,
    status: reportDB.status,
    metadata: {
      ipAddress: reportDB.metadata?.ipAddress,
      userAgent: reportDB.metadata?.userAgent,
      submittedAt: reportDB.metadata?.createdAt, 
      updatedAt: reportDB.metadata?.updatedAt,   
      resolvedAt: reportDB.metadata?.resolvedAt,
      estimatedResponseTime: reportDB.metadata?.estimatedResponseTime,
      similarReportsNearby: reportDB.metadata?.similarReportsNearby 
    },
    userId: reportDB.userId, 
    mediaUrls: reportDB.mediaUrls, 
 
  };
 }
}