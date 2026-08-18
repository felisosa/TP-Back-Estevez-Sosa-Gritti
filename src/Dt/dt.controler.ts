import { Request, Response, NextFunction } from "express"
import { Dt } from "./dt.entity.js"
import { orm } from "../shared/db/orm.js";

const em = orm.em

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

async function findAll(req:Request, res:Response): Promise<void> {
    try {
        const dts = await em.find(Dt, {})
        res.status(200).json({message: 'Directores tecnicos', data: dts})
    } catch (error:any) {
        res.status(500).json({message: error.message})
    }
}
async function findOne(req:Request,res:Response): Promise<void> {
    try {
        const id = Number.parseInt(req.params.id)
        const dt = await em.findOneOrFail(Dt, {id})
        res.status(200).json({message: 'Director tecnico encontrado', data: dt})
    } catch (error:any) {
        if (error.name==='NotFoundError'){
            res.status(404).json({message: 'Director tecnico no encontrado'});
            return;
        }
        res.status(500).json({message: 'Error interno del servidor', error: error.message});
    }
}

async function add(req:Request, res:Response): Promise<void> {
  try {
        const payload = req.body.sanitizedInput ?? req.body;
        const dt = em.create(Dt, payload)
        await em.flush()
        res.status(201).json({message: 'Director tecnico creado', data: dt})
    } catch (error:any) {
        res.status(500).json({message: 'Error interno del servidor', error: error.message})
    }
}

async function update (req:Request, res:Response): Promise<void> {
    try {
        const id = Number.parseInt(req.params.id);
        const dt = await em.findOne(Dt, { id });
        if (!dt) {
            res.status(404).json({ message: 'Director tecnico no encontrado' });
            return;
        }
        const payload = req.body.sanitizedInput ?? req.body;
        em.assign(dt, payload);
        await em.flush();
        res.status(200).json({ message: 'Director tecnico actualizado', data: dt });
    } catch (error:any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}


async function remove(req:Request, res:Response): Promise<void> {
    try {
        const id = Number.parseInt(req.params.id)
        const dt = await em.findOne(Dt, { id })
        if (!dt) {
            res.status(404).json({ message: 'Director tecnico no encontrado' })
            return;
        }
        await em.removeAndFlush(dt)
        res.status(200).json({ message: 'Director tecnico eliminado' })
    } catch (error:any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

export { sanitizeDtInput, findAll, findOne, add, update, remove }
