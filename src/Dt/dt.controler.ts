import { Request, Response, NextFunction } from "express"
import { DtRepository } from "./dt.repository.js"
import { Dt } from "./dts.js"
const repository = new DtRepository()

function sanitizeDtInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={    
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        edad: req.body.edad,
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
    const dt = await repository.findOne({id})
    if(!dt){
       res.status(404).send({message: 'Director Tecnico no encontrado'})
       return
    }
    res.json({data:dt})
}  

async function add(req:Request, res:Response) {
    const input = req.body.sanitizedInput

    const dtInput = new Dt( 
        input.nombre,
        input.apellido,
        input.dni,
        input.edad,
    )

    const dt = await repository.add(dtInput)
    res.status(201).send({message: 'Director tecnico creado', data: dt})
    return
}

async function update (req:Request, res:Response) {
    req.body.sanitizedInput.id = req.params.id
    const dt = await repository.update(req.params.id, req.body.sanitizedInput);
    
    if (!dt){
        res.status(404).send({message: 'Director tecnico no encontrado'})
        return
    }
    
   
    res.status(200).send({message: 'Director tecnico modificado correctamente', data: dt})
    return
}


async function remove(req:Request, res:Response){
    const id=req.params.id
    const dt = await repository.delete({id})

    if(!dt){
        res.status(404).send({ message:'Director tecnico no encontrado'})
    } else {
      res.status(200).send({message:'Director tecnico eliminado correctamente'})
    }
    }

export { sanitizeDtInput, findAll, findOne, add, update, remove }