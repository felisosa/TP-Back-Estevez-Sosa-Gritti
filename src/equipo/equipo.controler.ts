import { Request, Response, NextFunction } from "express"
import { EquipoRepository } from "./equipo.repository.js"
import { Equipo } from "./equipos.js"
const repository = new EquipoRepository()

function sanitizeEquipoInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={    
        nombre: req.body.nombre,
        liga: req.body.liga,
        pais: req.body.pais,
        categoria: req.body.categoria
    }

    Object.keys(req.body.sanitizedInput).
    forEach((key)=> {
        if(req.body.sanitizedInput[key]===undefined){delete req.body.sanitizedInput[key]}
    })
    next()

}

async function findAll(req:Request, res:Response) {
    res.status[500].json({message: 'Not implemented'})
}
async function findOne(req:Request,res:Response) {
    res.status[500].json({message: 'Not implemented'})
}  

async function add(req:Request, res:Response) {
  res.status[500].json({message: 'Not implemented'})
}

async function update (req:Request, res:Response) {
    res.status[500].json({message: 'Not implemented'})
}


async function remove(req:Request, res:Response){
    res.status[500].json({message: 'Not implemented'})
    }

export { sanitizeEquipoInput, findAll, findOne, add, update, remove }