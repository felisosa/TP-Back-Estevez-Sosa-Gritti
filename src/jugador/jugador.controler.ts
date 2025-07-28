import { Request, Response, NextFunction } from "express"
import { JugadorRepository } from "./jugador.repository.js"
import { Jugador } from "./jugadores.js"
const repository = new JugadorRepository()

function sanitizeJugadorInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={    
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        edad: req.body.edad,
        numero: req.body.numero,
       
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
    const jugador = repository.findOne({id})
    if(!jugador){
       res.status(404).send({message: 'Jugador no encontrado'})
       return
    }
    res.json({data: jugador})
}

function add(req:Request, res:Response) {
    const input = req.body.sanitizedInput

    const jugadorInput = new Jugador(
        input.nombre,
        input.apellido,
        input.dni,
        input.edad,
        input.numero,
    )

    const jugador = repository.add(jugadorInput)
    res.status(201).send({message: 'Jugador creado', data: jugador})
    return
}

function update (req:Request, res:Response) {
    req.body.sanitizedInput.id = req.params.id
    const jugador= repository.update(req.body.sanitizedInput)
    
    if (!jugador){
        res.status(404).send({message: ' Jugador no encontrado'})
        return
    }
    
   
    res.status(200).send({message: ' Jugador modificado correctamente', data: jugador})
    return
}


function remove(req:Request, res:Response){
    const id=req.params.id
    const jugador = repository.delete({id})

    if(!jugador){
        res.status(404).send({ message:'Jugador no encontrado'})
    } else {
      res.status(200).send({message:'Jugador eliminado correctamente'})
    }
    }


    export { sanitizeJugadorInput, findAll, findOne, add, update, remove }
