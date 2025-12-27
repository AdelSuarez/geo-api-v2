import { Schema, model } from "mongoose";

const PopulationSchema = new Schema({
  id: { type: String, required: true },
  searchName: { type: String, required: true },
  name: { type: String, required: true },
  countryiso3code: { type: String, required: true },

  totalPopulation: {
    date: String,
    value: Number,
  },
  lifeExpectance: {
    date: String,
    value: Number,
  },
  populationGrowth: {
    date: String,
    value: Number,
  },
  male: {
    date: String,
    value: Number,
  },
  female: {
    date: String,
    value: Number,
  },

  createdAt: { type: Date, default: Date.now },
});

PopulationSchema.index({ name: 1 });

export const PopulationModel = model("Population", PopulationSchema);
