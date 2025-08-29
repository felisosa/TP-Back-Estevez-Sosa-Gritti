import { Router } from "express"
import { sanitizeTipoLesionInput, findAll, findOne, add, update, remove } from "./tipoLesion.controler.js"

export const tipoLesionRouter = Router() 

tipoLesionRouter.get('/', findAll)
tipoLesionRouter.get('/:id', findOne)
tipoLesionRouter.post('/', sanitizeTipoLesionInput, add)
tipoLesionRouter.put('/:id',sanitizeTipoLesionInput, update)
tipoLesionRouter.patch('/:id',sanitizeTipoLesionInput, update)
tipoLesionRouter.delete('/:id', remove)