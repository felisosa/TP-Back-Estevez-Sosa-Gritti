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
        posicion: req.body.posicion
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
    const jugador = await repository.findOne({id})
    if(!jugador){
       res.status(404).send({message: 'Jugador no encontrado'})
       return
    }
    res.json({data: jugador})
}

async function add(req:Request, res:Response) {
    const input = req.body.sanitizedInput

    const jugadorInput = new Jugador(
        input.nombre,
        input.apellido,
        input.dni,
        input.edad,
        input.numero,
        input.posicion,
    )

    const jugador = await repository.add(jugadorInput)
    res.status(201).send({message: 'Jugador creado', data: jugador})
    return
}

async function update (req:Request, res:Response) {
    req.body.sanitizedInput.id = req.params.id
    const jugador = await repository.update(req.params.id, req.body.sanitizedInput);
    
    if (!jugador){
        res.status(404).send({message: ' Jugador no encontrado'})
        return
    }
    
   
    res.status(200).send({message: ' Jugador modificado correctamente', data: jugador})
    return
}


async function remove(req:Request, res:Response){
    const id=req.params.id
    const jugador = await repository.delete({id})

    if(!jugador){
        res.status(404).send({ message:'Jugador no encontrado'})
    } else {
      res.status(200).send({message:'Jugador eliminado correctamente'})
    }
    }


    export { sanitizeJugadorInput, findAll, findOne, add, update, remove }
