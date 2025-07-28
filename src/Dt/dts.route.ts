import { Router } from "express"
import { sanitizeDtInput, findAll, findOne, add, update, remove } from "./dt.controler.js"

export const dtRouter = Router() 

dtRouter.get('/', findAll)
dtRouter.get('/:id', findOne)
dtRouter.post('/', sanitizeDtInput, add)
dtRouter.put('/:id',sanitizeDtInput, update)
dtRouter.patch('/:id',sanitizeDtInput, update)
dtRouter.delete('/:id', remove)