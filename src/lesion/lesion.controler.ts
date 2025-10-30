import { Request, Response, NextFunction } from "express"
//import { EquipoRepository } from "./equipo.repository.js"//
import { Lesion } from "./lesion.entity.js"
import { orm } from "../shared/db/orm.js";
import { Jugador } from "../jugador/jugador.entity.js";
import { tipoLesion } from "./tipoLesion.entity.js";

const em= orm.em
function sanitizeLesionInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={    
        cdLesion: req.body.cdLesion,
        descLesion: req.body.descLesion,
        jugador: req.body.jugador,
        tipoLesion: req.body.tipoLesion,
    }

    Object.keys(req.body.sanitizedInput).
    forEach((key)=> {
        if(req.body.sanitizedInput[key]===undefined){delete req.body.sanitizedInput[key]}
    })
    next()

}

async function findAll(req:Request, res:Response) {
   try {
    const lesiones = await em.find(
      Lesion,
      {},
      { populate: [] }
    )
    res.status(200).json({ message: 'Lesiones', data: lesiones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const lesiones = await em.findOneOrFail(
      Lesion,
      { id },
      { populate: ['jugador', 'tipoLesion'] }
    )
    res.status(200).json({ message: 'found lesion', data: lesiones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}  

async function add(req:Request, res:Response) {
   try {
    const input = { ...req.body.sanitizedInput }

    // convert numeric relation ids into references
    if (input.jugador && typeof input.jugador === 'number') {
      input.jugador = em.getReference(Jugador, Number(input.jugador))
    }
    if (input.tipoLesion && typeof input.tipoLesion === 'number') {
      input.tipoLesion = em.getReference(tipoLesion, Number(input.tipoLesion))
    }

    const lesiones = em.create(Lesion, input)
    await em.flush()
    res.status(201).json({ message: 'Lesion creada', data: lesiones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update (req:Request, res:Response) {
    try {
    const id = Number.parseInt(req.params.id)
    const lesionesToUpdate = await em.findOneOrFail(Lesion, { id })
    const input = { ...req.body.sanitizedInput }
    if (input.jugador && typeof input.jugador === 'number') {
      input.jugador = em.getReference(Jugador, Number(input.jugador))
    }
    if (input.tipoLesion && typeof input.tipoLesion === 'number') {
      input.tipoLesion = em.getReference(tipoLesion, Number(input.tipoLesion))
    }
    em.assign(lesionesToUpdate, input)
    await em.flush()
    res
      .status(200)
      .json({ message: 'lesion actualizada', data: lesionesToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove(req:Request, res:Response){
    try {
        const id = Number.parseInt(req.params.id)
        const lesion = em.getReference(Lesion, id)
        await em.removeAndFlush(lesion)
        res.status(200).send({ message: 'Lesion eliminada' })
      } catch (error: any) {
        res.status(500).json({ message: error.message })
      }
    }

export { sanitizeLesionInput, findAll, findOne, add, update, remove }