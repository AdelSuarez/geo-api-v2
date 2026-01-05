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

export interface updateData {
    title: string;
    status: string;
    priority: string;
    description: string;
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




export interface IReportResponse {
  id: string | undefined;  
  title: string;
  description: string;
  category: string;
  location: {
    coordinates: [number, number];
    address?: string;
    city: string;
    country: string;
  };
  priority: string;
  trackingCode: string;
  status: string;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    submittedAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    estimatedResponseTime: string;
    similarReportsNearby?: number;
  };
  userId?: string;
  mediaUrls?: string[];
}


export interface CreateReportInput {
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
  ipAddress?: string;
  userAgent?: string;
}


export interface UpdateReportInput {
  title?: string;
  description?: string;
  category?: ReportCategory;
  status?: ReportStatus;
  priority?: ReportPriority;
  address?: string;
  mediaUrls?: string[];
  resolvedAt?: Date;
}


