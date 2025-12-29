import { Schema, model, Document } from "mongoose";

export interface IPopulationDB extends Document {
  id: string;
  searchName: string;
  name: string;
  countryiso3code: string;
  totalPopulation: {
    date: string;
    value: number;
  };
  lifeExpectance: {
    date: string;
    value: number;
  };
  populationGrowth: {
    date: string;
    value: number;
  };
  male: {
    date: string;
    value: number;
  };
  female: {
    date: string;
    value: number;
  };
  createdAt: Date;
}

const PopulationSchema = new Schema<IPopulationDB>({
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

export const PopulationModel = model<IPopulationDB>(
  "Population",
  PopulationSchema
);
