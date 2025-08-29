import { Router } from "express"
import { sanitizeLesionInput, findAll, findOne, add, update, remove } from "./lesion.controler.js"

export const lesionRouter = Router() 

lesionRouter.get('/', findAll)
lesionRouter.get('/:id', findOne)
lesionRouter.post('/', sanitizeLesionInput, add)
lesionRouter.put('/:id',sanitizeLesionInput, update)
lesionRouter.patch('/:id',sanitizeLesionInput, update)
lesionRouter.delete('/:id', remove)