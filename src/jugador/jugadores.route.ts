import { Router, type RequestHandler } from "express"
import { sanitizeJugadorInput, findAll, findOne, add, update, remove } from "./jugador.controler.js"

export const jugadorRouter = Router() 

// Async wrapper to satisfy Express typings and catch rejections
const asyncHandler = (fn: any): RequestHandler => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next)
}

jugadorRouter.get('/', asyncHandler(findAll))
jugadorRouter.get('/:id', asyncHandler(findOne))
jugadorRouter.post('/', sanitizeJugadorInput as RequestHandler, asyncHandler(add))
jugadorRouter.put('/:id', sanitizeJugadorInput as RequestHandler, asyncHandler(update))
jugadorRouter.patch('/:id', sanitizeJugadorInput as RequestHandler, asyncHandler(update))
jugadorRouter.delete('/:id', asyncHandler(remove))