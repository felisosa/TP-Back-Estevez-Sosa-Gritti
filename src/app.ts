import 'reflect-metadata'
import Express, { NextFunction, Request, Response } from "express"
import { equipoRouter } from "./equipo/equipo.routes.js";
import { partidoRouter } from "./partido/partido.routes.js";
import { jugadorRouter } from "./jugador/jugadores.route.js";
import { dtRouter } from "./Dt/dts.route.js";
import { orm, syncSchema } from "./shared/db/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { lesionRouter } from './lesion/lesion.routes.js';
import { tipoLesionRouter } from './lesion/tipoLesion.route.js';
import { contratoRouter } from './contrato/contrato.routes.js';

const app = Express()
app.use(Express.json())  
    
app.use((req,res, next) => {
    
     RequestContext.create(orm.em, next)
})

app.use('/api/equipos', equipoRouter)
app.use('/api/partido', partidoRouter)
app.use('/api/jugadores', jugadorRouter)
app.use('/api/dts', dtRouter)
app.use('/api/lesion', lesionRouter)
app.use('/api/tipoLesiones', tipoLesionRouter)
app.use('/api/contrato', contratoRouter)

app.use((_, res) => {
    res.status(404).send({message: 'Busqueda no encontrada'})
})

await syncSchema()  //nunca en la produccion

app.listen(3000, ()=> {
    console.log('Server running on http://localhost:3000/')
})