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

app.use('/api/equipos', equipoRouter)
app.use('/api/partido', partidoRouter)
app.use('/api/jugadores', jugadorRouter)
app.use('/api/dts', dtRouter)
app.use('/api/lesiones', lesionRouter)
app.use('/api/tipoLesiones', tipoLesionRouter)
app.use('/api/contrato', contratoRouter)
app.use('/api/estadisticasJugador', estadisticasJugadorRouter)

// Simple healthcheck
app.get('/health', (_: Request, res: Response) => {
    res.status(200).send({ status: 'ok' })
})

app.use((_, res) => {
    res.status(404).send({message: 'Busqueda no encontrada'})
})

await syncSchema()  //nunca en la produccion

app.listen(3000, ()=> {
    console.log('Server running on http://localhost:3000/')
})
