import { Router } from "express"
import { sanitizePersonaInput, findAll, findOne, add, update, remove } from "./persona.controler.js"

export const personaRouter = Router() 

personaRouter.get('/', findAll)
personaRouter.get('/:id', findOne)
personaRouter.post('/', sanitizePersonaInput, add)
personaRouter.put('/:id',sanitizePersonaInput, update)
personaRouter.patch('/:id',sanitizePersonaInput, update)
personaRouter.delete('/:id', remove)