import { 
  IReportResponse, 
  CreateReportInput,  
  UpdateReportInput   
} from "../interface/geoReport/geoReport.interface";
import { ReportModel, IReportDB } from "../models/geoReport.model";

// Tipo para la preparación de datos
interface ReportForDB {
  title: string;
  description: string;
  category: string;
  location: {
    type: "Point";
    coordinates: [number, number];
    address?: string;
    city: string;
    country: string;
  };
  priority: string;
  userId?: string;
  mediaUrls: string[];
  trackingCode: string;
  status: string;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
    estimatedResponseTime: string;
    similarReportsNearby?: number;
  };
}

export class ReportService {
  
  /**
   * Crear un nuevo reporte 
   */
  async createReport(reportData: CreateReportInput): Promise<IReportResponse> {
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
      return this._mapReportResponse(savedReport);
      
    } catch (error) {
      console.error(" Service: Error en createReport:", error);
      throw error;
    }
  }

  /**
   * Obtener reporte por ID 
   */
  async getReportById(id: string): Promise<IReportResponse | null> {
    try {
      console.log(` Service: Buscando reporte ID: ${id}`);
      
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
  async getAllReports(): Promise<IReportResponse[]> {
    try {
      console.log(" Service: Obteniendo todos los reportes...");
      
      const reports = await ReportModel.find()
        .sort({ createdAt: -1 })
        .limit(50);
      
      console.log(` Service: ${reports.length} reportes obtenidos`);
      
      return reports.map(report => this._mapReportResponse(report));
      
    } catch (error) {
      console.error(" Service: Error obteniendo reportes:", error);
      throw error;
    }
  }

  /**
   * Eliminar reporte 
   */
  async deleteReport(id: string): Promise<IReportResponse | null> {
    try {
      console.log(` Service: Eliminando reporte ID: ${id}`);
      
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
   * Actualizar reporte 
   */
  async updateReport(id: string, updateData: UpdateReportInput): Promise<IReportResponse | null> {
    try {
      console.log(` Service: Actualizando reporte ID: ${id}`);
      
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
  private _prepareReportForDB(data: CreateReportInput): ReportForDB {
    const trackingCode = `REP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    return {
      title: data.title?.trim(),
      description: data.description?.trim(),
      category: data.category,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(data.longitude.toString()),
          parseFloat(data.latitude.toString())
        ],
        address: data.address?.trim(),
        city: data.city?.trim(),
        country: data.country?.trim()
      },
      priority: data.priority || "medium",
      userId: data.userId?.trim(),
      mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
      trackingCode,
      status: "pending",
      metadata: {
        ipAddress: data.ipAddress || "Unknown",
        userAgent: data.userAgent || "Unknown",
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedResponseTime: "72 horas",
        similarReportsNearby: 0
      }
    };
  }

  /**
   * Mapear respuesta 
   */
  private _mapReportResponse(reportDB: IReportDB): IReportResponse {
    // Convertir ObjectId a string de forma segura(odio id)
    const id = reportDB._id ? String(reportDB._id) : '';
    
    return {
      id,
      title: reportDB.title,
      description: reportDB.description,
      category: reportDB.category,
      location: {
        coordinates: reportDB.location?.coordinates || [0, 0],
        address: reportDB.location?.address,
        city: reportDB.location?.city || '',
        country: reportDB.location?.country || ''
      },
      priority: reportDB.priority,
      trackingCode: reportDB.trackingCode,
      status: reportDB.status,
      metadata: {
        ipAddress: reportDB.metadata?.ipAddress,
        userAgent: reportDB.metadata?.userAgent,
        submittedAt: reportDB.metadata?.createdAt || new Date(),
        updatedAt: reportDB.metadata?.updatedAt || new Date(),
        resolvedAt: reportDB.metadata?.resolvedAt,
        estimatedResponseTime: reportDB.metadata?.estimatedResponseTime || "72 horas",
        similarReportsNearby: reportDB.metadata?.similarReportsNearby || 0
      },
      userId: reportDB.userId,
      mediaUrls: reportDB.mediaUrls || []
    };
  }
}