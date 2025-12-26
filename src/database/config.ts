import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    const url = process.env.MONGO_URL || "mongodb://mongo:27017/ciudad_data";

    await mongoose.connect(url);

    console.log("Base de datos conectada (MongoDB)");
  } catch (error) {
    console.log(error);
    throw new Error("Error al iniciar la base de datos");
  }
};
