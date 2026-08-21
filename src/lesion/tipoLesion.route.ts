import { Router } from "express"
import { findAll, findOne, add, update, remove } from "./tipoLesion.controler.js"
import { soloRol } from "../shared/middleware/auth.middleware.js"

export const tipoLesionRouter = Router()

tipoLesionRouter.get('/', findAll)
tipoLesionRouter.get('/:id', findOne)
tipoLesionRouter.post('/', soloRol('dt'), add)
tipoLesionRouter.put('/:id', soloRol('dt'), update)
tipoLesionRouter.patch('/:id', soloRol('dt'), update)
tipoLesionRouter.delete('/:id', soloRol('dt'), remove)
