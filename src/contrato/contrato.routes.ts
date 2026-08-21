import { Router } from "express"
import { sanitizeContratoInput, findAll, findOne, add, update, remove } from "./contrato.controler.js"
import { soloRol } from "../shared/middleware/auth.middleware.js"

export const contratoRouter = Router()

contratoRouter.get('/', findAll)
contratoRouter.get('/:id', findOne)
contratoRouter.post('/', soloRol('dt'), sanitizeContratoInput, add)
contratoRouter.put('/:id', soloRol('dt'), sanitizeContratoInput, update)
contratoRouter.patch('/:id', soloRol('dt'), sanitizeContratoInput, update)
contratoRouter.delete('/:id', soloRol('dt'), remove)