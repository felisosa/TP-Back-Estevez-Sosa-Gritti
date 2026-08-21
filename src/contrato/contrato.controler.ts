import { Request, Response, NextFunction } from "express"
import { Contrato } from "./contrato.entity.js"
import { orm } from "../shared/db/orm.js";
import { Dt } from "../Dt/dt.entity.js";
import { Jugador } from "../jugador/jugador.entity.js";
import { Equipo } from "../equipo/equipo.entity.js";

const em = orm.em

function sanitizeContratoInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={
        cdContrato: req.body.cdContrato,
        fechaIni: req.body.fechaIni,
        fechaFin: req.body.fechaFin,
        fechaRealFin: req.body.fechaRealFin,
        dt: req.body.dt,
        jugador: req.body.jugador,
        equipo: req.body.equipo,
    }

    Object.keys(req.body.sanitizedInput).
    forEach((key)=> {
        if(req.body.sanitizedInput[key]===undefined){delete req.body.sanitizedInput[key]}
    })
    next()

}

function resolveRelations(input: any) {
    if (input.dt && typeof input.dt === 'number') {
        input.dt = em.getReference(Dt, Number(input.dt))
    }
    if (input.jugador && typeof input.jugador === 'number') {
        input.jugador = em.getReference(Jugador, Number(input.jugador))
    }
    if (input.equipo && typeof input.equipo === 'number') {
        input.equipo = em.getReference(Equipo, Number(input.equipo))
    }
    return input
}

async function findAll(req:Request, res:Response): Promise<void> {
    try {
        // Allow optional filtering by jugador via query string: /api/contrato?jugador=3
        // (ignorado si el usuario logueado es un jugador: ese siempre queda forzado a ver solo lo suyo)
        const { jugador } = req.query
        const where: any = {}
        if (req.user?.rol === 'jugador') {
            where.jugador = req.user.jugadorId
        } else if (jugador) {
            where.jugador = Number(jugador)
        }
        const contratos = await em.find(Contrato, where, { populate: ['dt', 'jugador', 'equipo'] })
        res.status(200).json({message: 'Contratos', data: contratos})
    } catch (error:any) {
        res.status(500).json({message: error.message})
    }
}
async function findOne(req:Request,res:Response): Promise<void> {
   try {
        const id = Number.parseInt(req.params.id)
        const contrato = await em.findOneOrFail(Contrato, {id}, { populate: ['dt', 'jugador', 'equipo'] })
        if (req.user?.rol === 'jugador' && contrato.jugador?.id !== req.user.jugadorId) {
            res.status(403).json({message: 'No tenés permiso para ver este contrato'})
            return
        }
        res.status(200).json({message: 'Contrato encontrado', data: contrato})
    } catch (error:any) {
        if (error.name==='NotFoundError'){
            res.status(404).json({message: 'Contrato no encontrado'});
            return;
        }
        res.status(500).json({message: 'Error interno del servidor', error: error.message});
    }
}

async function add(req:Request, res:Response): Promise<void> {
  try {
        const input = resolveRelations({ ...req.body.sanitizedInput })
        const contrato = em.create(Contrato, input)
        await em.flush()
        res.status(201).json({message: 'Contrato creado', data: contrato})
    } catch (error:any) {
        res.status(500).json({message: 'Error interno del servidor', error: error.message})
    }
}

async function update (req:Request, res:Response): Promise<void> {
    try {
        const id = Number.parseInt(req.params.id);
        const contrato = await em.findOne(Contrato, { id });
        if (!contrato) {
            res.status(404).json({ message: 'Contrato no encontrado' });
            return;
        }
        const input = resolveRelations({ ...req.body.sanitizedInput })
        em.assign(contrato, input);
        await em.flush();
        res.status(200).json({ message: 'Contrato actualizado', data: contrato });
    } catch (error:any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}


async function remove(req:Request, res:Response): Promise<void> {
     try {
        const id = Number.parseInt(req.params.id)
        const contrato = await em.findOne(Contrato, { id })
        if (!contrato) {
            res.status(404).json({ message: 'Contrato no encontrado' })
            return;
        }
        await em.removeAndFlush(contrato)
        res.status(200).json({ message: 'Contrato eliminado' })
    } catch (error:any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

export { sanitizeContratoInput, findAll, findOne, add, update, remove }
