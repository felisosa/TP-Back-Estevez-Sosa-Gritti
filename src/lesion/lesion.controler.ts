import { Request, Response, NextFunction } from "express"
//import { EquipoRepository } from "./equipo.repository.js"//
import { Lesion } from "./lesion.js"
import { orm } from "../shared/db/orm.js";
function sanitizeLesionInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={    
        cdLesion: req.body.nombre,
        descLesion: req.body.liga,
    }

    Object.keys(req.body.sanitizedInput).
    forEach((key)=> {
        if(req.body.sanitizedInput[key]===undefined){delete req.body.sanitizedInput[key]}
    })
    next()

}

async function findAll(req:Request, res:Response) {
    res.status(500).json({message: 'Not implemented'})
}
async function findOne(req:Request,res:Response) {
    res.status(500).json({message: 'Not implemented'})
}  

async function add(req:Request, res:Response) {
  res.status(500).json({message: 'Not implemented'})
}

async function update (req:Request, res:Response) {
    res.status(500).json({message: 'Not implemented'})
}


async function remove(req:Request, res:Response){
    res.status(500).json({message: 'Not implemented'})
    }

export { sanitizeLesionInput, findAll, findOne, add, update, remove }