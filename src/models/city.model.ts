import { Schema, model } from "mongoose";

// Definimos qué campos vamos a guardar para el Cache
const CitySchema = new Schema({
  name: { type: String, required: true },
  lat: { type: String, required: true },
  lng: { type: String, required: true },
  countryName: { type: String },
  population: { type: Number },
  // Importante: Guardamos cuándo se creó para saber si es vieja
  createdAt: { type: Date, default: Date.now },
});

// Creamos un índice para buscar súper rápido por nombre
CitySchema.index({ name: 1 });

export const CityModel = model("City", CitySchema);
