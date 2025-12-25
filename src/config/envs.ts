import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";

// Variables de geonames
export const GEONAMES_USER = process.env.GEONAMES_USER;
export const GEONAMES_API_URL =
  process.env.GEONAMES_API_URL || "http://api.geonames.org";
