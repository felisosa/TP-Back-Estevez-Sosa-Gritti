import { Router } from "express"
import { sanitizePartidoInput, findAll, findOne, add, update, remove } from "./partido.controler.js"
import { soloRol } from "../shared/middleware/auth.middleware.js"

export const partidoRouter = Router()

partidoRouter.get('/', findAll)
partidoRouter.get('/:id', findOne)
partidoRouter.post('/', soloRol('dt'), sanitizePartidoInput, add)
partidoRouter.put('/:id', soloRol('dt'), sanitizePartidoInput, update)
partidoRouter.patch('/:id', soloRol('dt'), sanitizePartidoInput, update)
partidoRouter.delete('/:id', soloRol('dt'), remove)