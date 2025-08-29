import { Request, Response, NextFunction } from "express"
import { Contrato } from "./contratos.js"
import { orm } from "../shared/db/orm.js";

function sanitizeContratoInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={    
        fechaIni: req.body.nombre,
        fechaFin: req.body.liga,
        fechaRealFin: req.body.pais
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

export { sanitizeContratoInput, findAll, findOne, add, update, remove }