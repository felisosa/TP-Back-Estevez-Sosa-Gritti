import { Router } from "express"
import { findAll, findOne, add, update, remove } from "./estadisticasJugador.controler.js"
import { soloRol } from "../shared/middleware/auth.middleware.js"

export const estadisticasJugadorRouter = Router()

estadisticasJugadorRouter.get('/', findAll)
estadisticasJugadorRouter.get('/:id', findOne)
estadisticasJugadorRouter.post('/', soloRol('dt'), add)
estadisticasJugadorRouter.put('/:id', soloRol('dt'), update)
estadisticasJugadorRouter.patch('/:id', soloRol('dt'), update)
estadisticasJugadorRouter.delete('/:id', soloRol('dt'), remove)