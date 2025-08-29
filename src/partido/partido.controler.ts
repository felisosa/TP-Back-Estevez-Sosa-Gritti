import { Request, Response, NextFunction } from "express"
import { Partido } from "./partidos.js"

function sanitizePartidoInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={    
        fecha: req.body.fecha,
        tipo: req.body.tipo,
        horario: req.body.horario,
        lugar: req.body.lugar,
        rival: req.body.rival,
        nroFecha: req.body.nroFecha,
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

export { sanitizePartidoInput, findAll, findOne, add, update, remove }