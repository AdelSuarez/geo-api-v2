import { Router } from "express";
import { getPopulation } from "../controllers/worldbank.controller";

const router = Router();

/**
 * @swagger
 * /geo/population/{countryCode}:
 *   get:
 *     summary: Obtener datos demográficos completos (Población, Esperanza de vida, etc.)
 *     tags:
 *       - WorldBank
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

export const wbRouter = router;
