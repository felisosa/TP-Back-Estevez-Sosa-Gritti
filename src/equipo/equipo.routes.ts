import { Router, type RequestHandler } from "express"
import { sanitizeEquipoInput, findAll, findOne, add, update, remove } from "./equipo.controler.js"

export const equipoRouter = Router() 

const asyncHandler = (fn: any): RequestHandler => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next)
}

equipoRouter.get('/', asyncHandler(findAll))
equipoRouter.get('/:id', asyncHandler(findOne))
equipoRouter.post('/', sanitizeEquipoInput as RequestHandler, asyncHandler(add))
equipoRouter.put('/:id', sanitizeEquipoInput as RequestHandler, asyncHandler(update))
equipoRouter.patch('/:id', sanitizeEquipoInput as RequestHandler, asyncHandler(update))
equipoRouter.delete('/:id', asyncHandler(remove))