import { Router } from "express"
import { sanitizeDtInput, findAll, findOne, add, update, remove } from "./dt.controler.js"
import { soloRol } from "../shared/middleware/auth.middleware.js"

export const dtRouter = Router()

dtRouter.get('/', findAll)
dtRouter.get('/:id', findOne)
dtRouter.post('/', soloRol('dt'), sanitizeDtInput, add)
dtRouter.put('/:id', soloRol('dt'), sanitizeDtInput, update)
dtRouter.patch('/:id', soloRol('dt'), sanitizeDtInput, update)
dtRouter.delete('/:id', soloRol('dt'), remove)