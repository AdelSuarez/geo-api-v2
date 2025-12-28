import path from "path";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { geoRouter } from "./routes/geographicandUrban.routes";
import { PORT } from "./config/envs";
// import { wbRouter } from "./routes/worldbank.routes";

const app: Application = express();

// Middlewares Globales
app.use(express.json());
app.use(cors());
app.use(helmet());

// !TODO Verificar si puedo sacar el swagger a una caperta, se debe llamar docs, asi se deja este archivo mas limpio, pero luego se verifica
// Configuración Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GeoApi | Info de ciudades",
      version: "1.0.0",
      description:
        "Api para obtener informacion de las ciudades, mundialisimas mundiales",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [path.join(__dirname, "./routes/*")],
  //   apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use("/geo", geoRouter);
// app.use("/geo", wbRouter);
// app.use("/geo", );

export default app;
