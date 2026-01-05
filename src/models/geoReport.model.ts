// src/models/geoReport.model.ts
import { Schema, model, Document } from "mongoose";



export interface IReportDB extends Document {
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
  status: string;
  priority: string;
  userId?: string;
  mediaUrls?: string[];
  trackingCode: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    ipAddress?: string;
    userAgent?: string;
    estimatedResponseTime: string;
    similarReportsNearby?: number;
  };
}

// 2. Schema 
const ReportSchema = new Schema<IReportDB>({
  title: { 
    type: String, 
    required: [true, "El título es requerido"],
    trim: true,
    minlength: [5, "El título debe tener al menos 5 caracteres"],
    maxlength: [100, "El título no puede exceder 100 caracteres"]
  },
  
  description: { 
    type: String, 
    required: [true, "La descripción es requerida"],
    trim: true,
    minlength: [10, "La descripción debe tener al menos 10 caracteres"],
    maxlength: [1000, "La descripción no puede exceder 1000 caracteres"]
  },
  
  category: { 
    type: String, 
    required: [true, "La categoría es requerida"],
    enum: {
      values: ["pothole", "street_light", "garbage", "water_leak", 
               "traffic_signal", "public_transport", "parks", "safety", "other"],
      message: "{VALUE} no es una categoría válida"
    }
  },
  
  location: {
    coordinates: { 
      type: [Number], 
      required: [true, "Las coordenadas son requeridas"],
      validate: {
        validator: function(coords: number[]) {
          return coords.length === 2 &&
                 coords[0] >= -180 && coords[0] <= 180 && // longitud
                 coords[1] >= -90 && coords[1] <= 90;     // latitud
        },
        message: "Coordenadas inválidas. Formato: [longitud, latitud]"
      }
    },
    address: { 
      type: String, 
      trim: true,
      maxlength: [200, "La dirección no puede exceder 200 caracteres"]
    },
    city: { 
      type: String, 
      required: [true, "La ciudad es requerida"],
      trim: true 
    },
    country: { 
      type: String, 
      required: [true, "El país es requerido"],
      trim: true 
    }
  },
  
  status: { 
    type: String, 
    enum: {
      values: ["pending", "under_review", "in_progress", "resolved", "rejected"],
      message: "{VALUE} no es un estado válido"
    },
    default: "pending"
  },
  
  priority: { 
    type: String, 
    enum: {
      values: ["low", "medium", "high", "critical"],
      message: "{VALUE} no es una prioridad válida"
    },
    default: "medium"
  },
  
  userId: { 
    type: String, 
    trim: true 
  },
  
  mediaUrls: [{ 
    type: String,
    validate: {
      validator: function(url: string) {
        return url.startsWith("http://") || url.startsWith("https://");
      },
      message: "URL debe comenzar con http:// o https://"
    }
  }],
  
  trackingCode: { 
    type: String, 
    required: true,
    unique: true,
    index: true 
  },
  
  metadata: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    estimatedResponseTime: { type: String, default: "72 horas" },
    similarReportsNearby: { type: Number, default: 0 }
  }
});


// 3. Middleware para generar trackingCode automáticamente 
ReportSchema.pre("save", function() {
  
  const doc = this as IReportDB;
  
  if (!doc.trackingCode) {
   
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    doc.trackingCode = `REP-${random}`;
  }
  
  // Actualizar updatedAt
  doc.metadata.updatedAt = new Date();
});


export const ReportModel = model<IReportDB>("Report", ReportSchema);