import { Router } from "express";
import { getCity } from "../controllers/geonames.controlles";

const router = Router();

/**
 * @swagger
 * /geo/city/{city}:
 *   get:
 *     summary: Obtener latitud, longitud y datos de una ciudad
 *     tags:
 *       - Geo
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         description: Nombre de la ciudad (ej. caracas)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos de la ciudad
 *       404:
 *         description: Ciudad no encontrada
 */

router.get("/city/:city", getCity);

export const geoRouter = router;
