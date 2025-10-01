import { Router } from "express"
import { findAll, findOne, add, update, remove } from "./tipoLesion.controler.js"

export const tipoLesionRouter = Router() 

tipoLesionRouter.get('/', findAll)
tipoLesionRouter.get('/:id', findOne)
tipoLesionRouter.post('/', add)
tipoLesionRouter.put('/:id', update)
tipoLesionRouter.patch('/:id', update)
tipoLesionRouter.delete('/:id', remove)
