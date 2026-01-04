import { Schema, model, Document } from "mongoose";


export interface IIncidentDB extends Document {
  type: string;
  line: string;
  description: string;
  stopId?: string; // Opcional
  createdAt: Date;
}


const IncidentSchema = new Schema<IIncidentDB>({
  type: { type: String, required: true },
  line: { type: String, required: true },
  description: { type: String, required: true },
  stopId: { type: String, required: false },

  
  createdAt: { type: Date, default: Date.now },
});

// buscar por linea
IncidentSchema.index({ line: 1 });

// exportar modelo
export const IncidentModel = model<IIncidentDB>("Incident", IncidentSchema);