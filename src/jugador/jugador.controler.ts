import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js";
import { Jugador } from "./jugador.entity.js";
const em= orm.em

function sanitizeJugadorInput(req: Request, _res: Response, next: NextFunction) {
    // Map only allowed fields
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        edad: req.body.edad,
        numero: req.body.numero,
        posicion: req.body.posicion,
    };
    Object.keys(req.body.sanitizedInput).forEach((k) => {
        if (req.body.sanitizedInput[k] === undefined) delete req.body.sanitizedInput[k];
    });
    next();
}

async function findAll(req:Request, res:Response): Promise<void> {
    try {
        // Allow optional filtering by posicion via query string: /api/jugadores?posicion=Delantero
        const { posicion } = req.query;
        const where: any = {};
        if (posicion) {
            // use exact match; caller can provide the exact posicion value
            where.posicion = String(posicion);
        }
        const jugadores = await em.find(Jugador, where)
        res.status(200).json({message: 'Jugadores', data: jugadores})
    } catch (error:any) {
        res.status(500).json({message: error.message})
    }
}

async function findOne(req:Request,res:Response): Promise<void> {
    try {
        const id = Number.parseInt(req.params.id)
        const jugador = await em.findOneOrFail(Jugador, {id})
        res.status(200).json({message: 'Jugador encontrado', data: jugador})
    } catch (error:any) {
        if (error.name==='NotFoundError'){
            res.status(404).json({message: 'Jugador no encontrado'});
            return;
        }
        res.status(500).json({message: 'Error interno del servidor', error: error.message});
    }
}

async function add(req:Request, res:Response): Promise<void> {
    try {
        const payload = req.body.sanitizedInput ?? req.body;
        const jugador = em.create(Jugador, payload)
        await em.flush()
        res.status(201).json({message: 'Jugador creado', data: jugador})
    } catch (error:any) {
        res.status(500).json({message: 'Error interno del servidor', error: error.message})
    }
}

async function update (req:Request, res:Response): Promise<void> {
    try {
        const id = Number.parseInt(req.params.id);
        const jugador = await em.findOne(Jugador, { id });
        if (!jugador) {
            res.status(404).json({ message: 'Jugador no encontrado' });
            return;
        }
        const payload = req.body.sanitizedInput ?? req.body;
        em.assign(jugador, payload);
        await em.flush();
        res.status(200).json({ message: 'Jugador actualizado', data: jugador });
    } catch (error:any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

async function remove(req:Request, res:Response): Promise<void> {
    try {
        const id = Number.parseInt(req.params.id)
        const jugador = await em.findOne(Jugador, { id })
        if (!jugador) {
            res.status(404).json({ message: 'Jugador no encontrado' })
            return;
        }
        await em.removeAndFlush(jugador)
        res.status(200).json({ message: 'Jugador eliminado' })
    } catch (error:any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

export { sanitizeJugadorInput, findAll, findOne, add, update, remove }


   