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
    res.json({data:await repository.findAll()})
}
async function findOne(req:Request,res:Response) {
    const id = req.params.id
    const equipo = await repository.findOne({id})
    if(!equipo){
       res.status(404).send({message: 'Equipo no encontrado'})
       return
    }
    res.json({data:equipo})
}  

async function add(req:Request, res:Response) {
    const input = req.body.sanitizedInput

    const equipoInput = new Equipo( 
        input.nombre,
        input.liga,
        input.pais,
        input.categoria
    )

    const equipo = await repository.add(equipoInput)
    res.status(201).send({message: 'Equipo creado', data: equipo})
    return
}

async function update (req:Request, res:Response) {
    req.body.sanitizedInput.id = req.params.id
    const equipo = await repository.update(req.params.id, req.body.sanitizedInput);
    
    if (!equipo){
        res.status(404).send({message: 'Equipo no encontrado'})
        return
    }
    
   
    res.status(200).send({message: 'Equipo modificado correctamente', data: equipo})
    return
}


async function remove(req:Request, res:Response){
    const id=req.params.id
    const equipo = await repository.delete({id})

    if(!equipo){
        res.status(404).send({ message:'Equipo no encontrado'})
    } else {
      res.status(200).send({message:'Equipo eliminado correctamente'})
    }
    }

export { sanitizeEquipoInput, findAll, findOne, add, update, remove }