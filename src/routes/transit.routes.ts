import { Router } from "express";
import { getTflStatus, getTflEta, createIncident, deleteIncident, updateIncident } from "../controllers/tfl.controller";
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
 *         description: ID de la estacion (ej. 940GZZLUBST Baker Street, 940GZZLUKSX Kings Cross St Pancras, 940GZZLUVIC Victoria)
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
 *                     example: "2026-01-04T20:05:00Z"
 *       400:
 *         description: Falta el parametro stop_id
 */
router.get("/eta", getTflEta);

/**
 * @swagger
 * /transit/incident:
 *   post:
 *     summary: Reportar un incidente de transporte
 *     description: Guarda un nuevo incidente en la base de datos local.
 *     tags:
 *       - Transporte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - line
 *               - description
 *             properties:
 *               type:
 *                 type: string
 *                 description: Tipo de incidente (ej. "retraso", "huelga", "accidente")
 *                 example: retraso
 *               line:
 *                 type: string
 *                 description: Nombre de la línea afectada
 *                 example: Bakerloo
 *               description:
 *                 type: string
 *                 description: Detalle de lo sucedido
 *                 example: Tren detenido por problemas de señalizacion
 *               stopId:
 *                 type: string
 *                 description: (Opcional) ID de la estación donde ocurre
 *                 example: 940GZZLUBST
 *     responses:
 *       201:
 *         description: Incidente creado exitosamente
 *       400:
 *         description: Faltan datos obligatorios
 *       500:
 *         description: Error del servidor al guardar
 */
router.post("/incident", createIncident);

/**
 * @swagger
 * /transit/incident/{id}:
 *   delete:
 *     summary: Eliminar un incidente
 *     description: Borra un incidente de la base de datos usando su ID.
 *     tags:
 *       - Transporte
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de MongoDB del incidente (ej. 659d4f...)
 *     responses:
 *       200:
 *         description: Eliminado correctamente
 *       404:
 *         description: Incidente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/incident/:id", deleteIncident);

/**
 * @swagger
 * /transit/incident/{id}:
 *   put:
 *     summary: Editar un incidente existente
 *     tags:
 *       - Transporte
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del incidente a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Nuevo tipo
 *               line:
 *                 type: string
 *                 description: Nueva linea
 *               description:
 *                 type: string
 *                 description: Nueva descripcion
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       404:
 *         description: Incidente no encontrado
 */
router.put("/incident/:id", updateIncident);


export const transitRouter = router;