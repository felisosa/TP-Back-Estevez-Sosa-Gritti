import { Router } from "express"
import { sanitizeLesionInput, findAll, findOne, add, update, remove } from "./lesion.controler.js"
import { soloRol } from "../shared/middleware/auth.middleware.js"

export const lesionRouter = Router()

lesionRouter.get('/', findAll)
lesionRouter.get('/:id', findOne)
lesionRouter.post('/', soloRol('dt'), sanitizeLesionInput, add)
lesionRouter.put('/:id', soloRol('dt'), sanitizeLesionInput, update)
lesionRouter.patch('/:id', soloRol('dt'), sanitizeLesionInput, update)
lesionRouter.delete('/:id', soloRol('dt'), remove)