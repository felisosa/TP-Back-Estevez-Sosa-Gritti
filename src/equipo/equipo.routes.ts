import { Router, type RequestHandler } from "express"
import { sanitizeEquipoInput, findAll, findOne, add, update, remove } from "./equipo.controler.js"
import { soloRol } from "../shared/middleware/auth.middleware.js"

export const equipoRouter = Router()

const asyncHandler = (fn: any): RequestHandler => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next)
}

equipoRouter.get('/', asyncHandler(findAll))
equipoRouter.get('/:id', asyncHandler(findOne))
equipoRouter.post('/', soloRol('dt'), sanitizeEquipoInput as RequestHandler, asyncHandler(add))
equipoRouter.put('/:id', soloRol('dt'), sanitizeEquipoInput as RequestHandler, asyncHandler(update))
equipoRouter.patch('/:id', soloRol('dt'), sanitizeEquipoInput as RequestHandler, asyncHandler(update))
equipoRouter.delete('/:id', soloRol('dt'), asyncHandler(remove))