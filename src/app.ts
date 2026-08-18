import 'dotenv/config'
import 'reflect-metadata'
import { orm, syncSchema } from "./shared/db/orm.js";
import Express, { NextFunction, Request, Response } from "express"
import cors from 'cors' 
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { equipoRouter } from "./equipo/equipo.routes.js";
import { partidoRouter } from "./partido/partido.routes.js";
import { jugadorRouter } from "./jugador/jugadores.route.js";
import { dtRouter } from "./Dt/dts.route.js";
import { RequestContext } from "@mikro-orm/core";
import { lesionRouter } from './lesion/lesion.routes.js';
import { tipoLesionRouter } from './lesion/tipoLesion.route.js';
import { contratoRouter } from './contrato/contrato.routes.js';
import { estadisticasJugadorRouter } from './jugador/estadisticaJugador.route.js';
import { PORT } from './config.js';
import { authRouter } from './usuario/auth.route.js'
import { authMiddleware } from './shared/middleware/auth.middleware.js'

const app = Express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(Express.json())  

// CORS: allow local dev
app.use(cors())

// Serve static frontend from /public (at project root)
app.use(Express.static(path.join(__dirname, '..', 'public')))
    
app.use((req,res, next) => {
    
     RequestContext.create(orm.em, next)
})

app.use('/api/equipos', authMiddleware, equipoRouter)
app.use('/api/partido', authMiddleware, partidoRouter)
app.use('/api/jugadores', authMiddleware, jugadorRouter)
app.use('/api/dts', authMiddleware, dtRouter)
app.use('/api/lesiones', authMiddleware, lesionRouter)
app.use('/api/tipoLesiones', authMiddleware, tipoLesionRouter)
app.use('/api/contrato', authMiddleware, contratoRouter)
app.use('/api/estadisticasJugador', authMiddleware, estadisticasJugadorRouter)

app.use('/api/auth', authRouter)

// Simple healthcheck
app.get('/health', (_: Request, res: Response) => {
    res.status(200).send({ status: 'ok' })
})

app.use((_, res) => {
    res.status(404).send({message: 'Busqueda no encontrada'})
})

await syncSchema()  //nunca en la produccion

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}/`)
})
