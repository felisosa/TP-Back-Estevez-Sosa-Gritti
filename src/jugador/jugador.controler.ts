import { Request, Response, NextFunction } from "express"
import { Jugador } from "./jugadores.js"
import { orm } from "../shared/db/orm.js";
function sanitizeJugadorInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={    
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        edad: req.body.edad,
        numero: req.body.numero,
        posicion: req.body.posicion
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

export { sanitizeJugadorInput, findAll, findOne, add, update, remove }


   