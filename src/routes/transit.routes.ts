import { Router } from "express";
import { getTflStatus, getTflEta } from "../controllers/tfl.controller";
const router = Router();

/**
 * @swagger
 *   tags:
 *     name: Transporte
 *     description: Enpoints para obtener informacion de transportes
 */

/**
 * @swagger
 * /transit/routes/{city}:
 *   get:
 *     summary: Obtener rutas y su estado actual
 *     tags:
 *       - Transporte
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         description: Nombre de la ciudad (ej. london)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de rutas y estados recuperada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 mode:
 *                   type: string
 *                   example: "overground"
 *                 route:
 *                   type: string
 *                   example: "Bakerloo"
 *                 status:
 *                   type: string
 *                   example: "Good Service"
 *                 details:
 *                   type: string
 *                   example: "Minor delays due to earlier signal failure."
 *                 
 *
 *       404:
 *         description: Rutas no encontradas
 */

router.get("/routes/:city", getTflStatus);

/**
 * @swagger
 * /transit/eta:
 *   get:
 *     summary: Obtener tiempo estimado de llegada (ETA)
 *     description: Retorna los proximos trenes ordenados por tiempo de llegada para una parada especifica.
 *     tags:
 *       - Transporte
 *     parameters:
 *       - in: query
 *         name: stop_id
 *         required: true
 *         description: ID de la estación (ej. 940GZZLUBST Baker Street, 940GZZLUKSX Kings Cross St Pancras, 940GZZLUVIC Victoria)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de llegadas recuperada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   line:
 *                     type: string
 *                     example: "Bakerloo"
 *                   destination:
 *                     type: string
 *                     example: "Elephant & Castle"
 *                   platform:
 *                     type: string
 *                     example: "Southbound - Platform 3"
 *                   timeToStation:
 *                     type: number
 *                     description: Tiempo en segundos
 *                     example: 120
 *                   expected:
 *                     type: string
 *                     description: Tiempo legible
 *                     example: "2 mins"
 *       400:
 *         description: Falta el parametro stop_id
 */
router.get("/eta", getTflEta);

export const transitRouter = router;