import { Router } from "express";
import { getCity } from "../controllers/geonames.controller";

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

export const geoRouter = router;
