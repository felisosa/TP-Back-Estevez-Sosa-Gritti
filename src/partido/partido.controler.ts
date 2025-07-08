import { Request, Response, NextFunction } from "express"
import { PartidoRepository } from "./partido.repository.js"
import { Partido } from "./partidos.js"
const repository = new PartidoRepository()

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

function findAll(req:Request, res:Response) {
    res.json({data:repository.findAll()})
}
function findOne(req:Request,res:Response) {
    const id = req.params.id
    const partido = repository.findOne({id})
    if(!partido){
       res.status(404).send({message: 'Partido no encontrado'})
       return
    }
    res.json({data:partido})
}  

function add(req:Request, res:Response) {
    const input = req.body.sanitizedInput

    const partidoInput = new Partido( 
        input.fecha,
        input.tipo,
        input.horario,
        input.lugar,
        input.rival,
        input.nroFecha,

    )

    const partido = repository.add(partidoInput)
    res.status(201).send({message: 'Partido creado', data: partido})
    return
}

function update (req:Request, res:Response) {
    req.body.sanitizedInput.id = req.params.id
    const partido = repository.update(req.body.sanitizedInput)
    
    if (!partido){
        res.status(404).send({message: 'Partido no encontrado'})
        return
    }
    
   
    res.status(200).send({message: 'Partido modificado correctamente', data: partido})
    return
}


function remove(req:Request, res:Response){
    const id=req.params.id
    const partido = repository.delete({id})

    if(!partido){
        res.status(404).send({ message:'Partido no encontrado'})
    } else {
      res.status(200).send({message:'Partido eliminado correctamente'})
    }
    }

export { sanitizePartidoInput, findAll, findOne, add, update, remove }