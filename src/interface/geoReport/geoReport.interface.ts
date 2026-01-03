// src/interface/geoReport.interface.ts
// ! No se modifica este archivo - Generado automáticamente con quicktype.io
// Basado en JSON de ejemplo para el sistema de reportes ciudadanos

/**
 * Interfaz para la petición POST /geo/report
 */
export interface CreateReportRequest {
  title: string;
  description: string;
  category: ReportCategory;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  address?: string;
  priority?: ReportPriority;
  mediaUrls?: string[];
  userId?: string;
}

/**
 * Interfaz para la respuesta del endpoint POST /geo/report
 */
export interface CreateReportResponse {
  success: boolean;
  message: string;
  data: ReportData;
  errors: ValidationError[] | null;
}

/**
 * Interfaz para la respuesta del endpoint GET /geo/reports/:id
 */
export interface GetReportResponse {
  success: boolean;
  data: ReportData;
}

/**
 * Interfaz para la respuesta del endpoint GET /geo/reports/nearby
 */
export interface NearbyReportsResponse {
  success: boolean;
  count: number;
  data: ReportData[];
  metadata: NearbyReportsMetadata;
}

/**
 * Datos principales del reporte
 */
export interface ReportData {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  location: ReportLocation;
  status: ReportStatus;
  priority: ReportPriority;
  userId?: string;
  trackingCode: string;
  mediaUrls?: string[];
  metadata: ReportMetadata;
}

/**
 * Ubicación geográfica del reporte
 */
export interface ReportLocation {
  type: "Point";
  coordinates: [number, number]; // [longitud, latitud]
  address?: string;
  city: string;
  country: string;
}

/**
 * Metadatos del reporte
 */
export interface ReportMetadata {
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  ipAddress?: string;
  userAgent?: string;
  estimatedResponseTime: string;
  similarReportsNearby?: number;
}

/**
 * Metadatos para reportes cercanos
 */
export interface NearbyReportsMetadata {
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  unit: "meters";
}

/**
 * Error de validación
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Tipos enumerados para TypeScript
 */
export type ReportCategory = 
  | "pothole"           // Bache
  | "street_light"      // Alumbrado público
  | "garbage"           // Basura acumulada
  | "water_leak"        // Fuga de agua
  | "traffic_signal"    // Semáforo dañado
  | "public_transport"  // Transporte público
  | "parks"             // Áreas verdes/parques
  | "safety"            // Seguridad
  | "other";            // Otro

export type ReportStatus = 
  | "pending"       // Pendiente
  | "under_review"  // En revisión
  | "in_progress"   // En progreso
  | "resolved"      // Resuelto
  | "rejected";     // Rechazado

export type ReportPriority = 
  | "low"       // Baja
  | "medium"    // Media
  | "high"      // Alta
  | "critical"; // Crítica

/**
 * Interface para estadísticas de reportes
 */
export interface ReportStats {
  total: number;
  byCategory: {
    [category in ReportCategory]: number;
  };
  byStatus: {
    [status in ReportStatus]: number;
  };
  byPriority: {
    [priority in ReportPriority]: number;
  };
  last30Days: {
    date: string;
    count: number;
  }[];
}