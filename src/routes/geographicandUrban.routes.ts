import { Router } from "express";
import {
  deleteCity,
  getCity,
  getHistoryCity,
} from "../controllers/geonames.controller";
import { getPopulation } from "../controllers/worldbank.controller";

const router = Router();

/**
 * @swagger
 *   tags:
 *     name: Geografico y urbano
 *     description: Endpoints relacionados con geografía y social
 */

/**
 * @swagger
 * /geo/city/{city}:
 *   get:
 *     summary: Obtener latitud, longitud y datos de una ciudad
 *     tags:
 *       - Geografico y urbano
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "3625428"
 *                 name:
 *                   type: string
 *                   example: "Caracas"
 *                 longitude:
 *                   type: string
 *                   example: "-66.87919"
 *                 latitude:
 *                   type: string
 *                   example: "10.48801"
 *                 bounding:
 *                   type: object
 *                   properties:
 *                     east:
 *                       type: number
 *                       example: -66.65036354001118
 *                     south:
 *                       type: number
 *                       example: 10.263169781214325
 *                     north:
 *                       type: number
 *                       example: 10.712852218785676
 *                     west:
 *                       type: number
 *                       example: -67.10802245998882
 *                     accuracyLevel:
 *                       type: number
 *                       example: 2
 *                 timezone:
 *                   type: object
 *                   properties:
 *                     gmtOffset:
 *                       type: number
 *                       example: -4
 *                     timeZoneId:
 *                       type: string
 *                       example: "America/Caracas"
 *                     dstOffset:
 *                       type: number
 *                       example: -4
 *
 *       404:
 *         description: Ciudad no encontrada
 */
router.get("/city/:city", getCity);

/**
 * @swagger
 * /geo/population/{countryCode}:
 *   get:
 *     summary: Obtener datos demográficos completos (Población, Esperanza de vida, etc.)
 *     tags:
 *       - Geografico y urbano
 *     parameters:
 *       - in: path
 *         name: countryCode
 *         required: true
 *         description: Código ISO del país (ej. CL, MX, AR)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "VE"
 *                 name:
 *                   type: string
 *                   example: "Venezuela, RB"
 *                 countryiso3code:
 *                   type: string
 *                   example: "VEN"
 *                 totalPopulation:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: "2024"
 *                     value:
 *                       type: number
 *                       example: 28405543
 *                 lifeExpectance:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: "2023"
 *                     value:
 *                       type: number
 *                       example: 72.514
 *                 populationGrowth:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: "2024"
 *                     value:
 *                       type: number
 *                       example: 0.3692
 *                 male:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: "2024"
 *                     value:
 *                       type: number
 *                       example: 14033859
 *                 female:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: "2024"
 *                     value:
 *                       type: number
 *                       example: 14371684
 *       404:
 *         description: País no encontrado o sin datos
 */
router.get("/population/:countryCode", getPopulation);

/**
 * @swagger
 * /geo/history:
 *   get:
 *     summary: Obtener el historial de ciudades consultadas y guardadas
 *     tags:
 *       - Geografico y urbano
 *     responses:
 *       200:
 *         description: Lista de ciudades en el historial
 */
router.get("/history", getHistoryCity);

/**
 * @swagger
 * /geo/city_delete/{id}:
 *   delete:
 *     summary: Eliminar una ciudad guardada en MongoDB por su ID
 *     tags:
 *       - Geografico y urbano
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la ciudad (el número que aparece en el historial, ej. 3625428)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ciudad eliminada del caché
 *       404:
 *         description: No se encontró la ciudad en la base de datos
 */
router.delete("/city_delete/:id", deleteCity);

export const geoRouter = router;
