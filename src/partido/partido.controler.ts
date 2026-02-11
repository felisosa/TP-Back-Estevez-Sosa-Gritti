import { Request, Response, NextFunction } from "express"
import {Partido} from './partido.entity.js'
import {orm} from '../shared/db/orm.js'

const em = orm.em

function sanitizePartidoInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={    
        fecha: req.body.fecha,
        tipo: req.body.tipo,
        horario: req.body.horario,
        lugar: req.body.lugar,
        rival: req.body.rival, // puedo poner rivales q no esten cargados. Esta bien?
        nroFecha: req.body.nroFecha,
        equipo: req.body.equipo, //este equipo es al q se le carga el partido lo puse pq esta en la relacion
                                    // lo puse pq esta en la relacion de equipo a partido pq est mal cargar un partido sin equipo, pero no se si es asi como se hace o si hay q cargar el partido y despues asignarle el equipo, lo puse asi pq es mas facil cargarlo todo junto pero no se si es asi como se hace o si hay q cargar el partido y despues asignarle el equipo, lo puse asi pq es mas facil cargarlo todo junto pero no se si es asi como se hace o si hay q cargar el partido y despues asignarle el equipo
                                    // ver dsp q hacer en los casos de finales, semis y eso q tdv no se saben los eqipos
    }

    Object.keys(req.body.sanitizedInput).
    forEach((key)=> {
        if(req.body.sanitizedInput[key]===undefined){delete req.body.sanitizedInput[key]}
    })
    next()

}

async function findAll(req:Request, res:Response) {
    try{
        const partidos = await em.find(Partido, {}, {populate: ['equipo']})  // en el popultate se pone las entidades relacionadas q se quieren traer
        res.status(200).json({message: "found all teams", data:partidos})
    } catch (error:any){
        res.status(500).json({message: error.message})
}
}
async function findOne(req:Request,res:Response) {
    res.status(500).json({message: 'Not implemented'})
}  

async function add(req:Request, res:Response) {
    try{
        const partido=em.create(Partido, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({message: 'Partido created', data: partido})
    }
    catch (error:any){
        res.status(500).json({message: error.message})
    }
  
}

async function update (req:Request, res:Response) {
    res.status(500).json({message: 'Not implemented'})
}


async function remove(req:Request, res:Response){
    res.status(500).json({message: 'Not implemented'})
    }


export { sanitizePartidoInput, findAll, findOne, add, update, remove }
