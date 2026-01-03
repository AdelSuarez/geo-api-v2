import { Router } from "express";
import { getTflStatus } from "../controllers/tfl.controller";
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

export const transitRouter = router;