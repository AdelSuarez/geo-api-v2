import { Schema, model, Document } from "mongoose";

export interface ICityDB extends Document {
  id: string;
  name: string;
  searchName: string;
  latitude: string;
  longitude: string;
  bounding?: {
    east: number;
    south: number;
    north: number;
    west: number;
    accuracyLevel: number;
  } | null;
  timezone?: {
    gmtOffset: number;
    timeZoneId: string;
    dstOffset: number;
  } | null;
  createdAt: Date;
}

const CitySchema = new Schema<ICityDB>({
  id: { type: String, required: true },
  searchName: { type: String, required: true },
  name: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },

  bounding: {
    east: Number,
    south: Number,
    north: Number,
    west: Number,
    accuracyLevel: Number,
  },

  timezone: {
    gmtOffset: Number,
    timeZoneId: String,
    dstOffset: Number,
  },
  //Guardamos cuando se creo para saber si es vieja
  createdAt: { type: Date, default: Date.now },
});

// Creamos un indice para buscar rapido por nombre
CitySchema.index({ name: 1 });

export const CityModel = model<ICityDB>("City", CitySchema);
