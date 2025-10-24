import { Router } from "express"
import { findAll, findOne, add, update, remove } from "./estadisticasJugador.controler.js"

export const estadisticasJugadorRouter = Router()

estadisticasJugadorRouter.get('/', findAll)
estadisticasJugadorRouter.get('/:id', findOne)
estadisticasJugadorRouter.post('/', add)
estadisticasJugadorRouter.put('/:id', update)
estadisticasJugadorRouter.patch('/:id', update)
estadisticasJugadorRouter.delete('/:id', remove)