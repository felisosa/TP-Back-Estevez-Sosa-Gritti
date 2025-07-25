import { Request, Response, NextFunction } from "express"
import { PersonaRepository } from "./persona.repository.js"
import { Persona } from "./personas.js"
const repository = new PersonaRepository()

function sanitizePersonaInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={    
        tipo: req.body.tipo,
        nombre: req.body.nombre,
        apellido: req.body.apellidi,
        dni: req.body.dni,
        edad: req.body.edad,
        numero: req.body.numero
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
    const persona = repository.findOne({id})
    if(!persona){
       res.status(404).send({message: 'persona no encontrado'})
       return
    }
    res.json({data:persona})
}  

function add(req:Request, res:Response) {
    const input = req.body.sanitizedInput

    const personaInput = new Persona( 
        input.tipo,
        input.nombre,
        input.apellido,
        input.dni,
        input.edad,
        input.numero
    )

    const persona = repository.add(personaInput)
    res.status(201).send({message: 'persona creada', data: persona})
    return
}

function update (req:Request, res:Response) {
    req.body.sanitizedInput.id = req.params.id
    const persona= repository.update(req.body.sanitizedInput)
    
    if (!persona){
        res.status(404).send({message: 'Persona no encontrada'})
        return
    }
    
   
    res.status(200).send({message: 'Persona modificada correctamente', data: persona})
    return
}


function remove(req:Request, res:Response){
    const id=req.params.id
    const persona = repository.delete({id})

    if(!persona){
        res.status(404).send({ message:'Persona no encontrada'})
    } else {
      res.status(200).send({message:'Persona eliminada correctamente'})
    }
    }

export { sanitizePersonaInput, findAll, findOne, add, update, remove }