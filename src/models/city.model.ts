import { Schema, model } from "mongoose";

// Definimos qué campos vamos a guardar para el Cache
const CitySchema = new Schema({
  id: { type: String, require: true },
  searchName: { type: String, require: true },
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

export const CityModel = model("City", CitySchema);
