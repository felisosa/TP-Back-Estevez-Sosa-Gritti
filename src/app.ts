import Express, { NextFunction, Request, Response } from "express"
import { equipoRouter } from "./equipo/equipo.routes.js";
import { partidoRouter } from "./partido/partido.routes.js";

const app = Express()
app.use(Express.json())  
    

app.use('/api/equipos', equipoRouter)
app.use('/api/partido', partidoRouter)

app.use((_, res) => {
    res.status(404).send({message: 'Busqueda no encontrada'})
})

app.listen(3000, ()=> {
    console.log('Server running on http://localhost:3000/')
})