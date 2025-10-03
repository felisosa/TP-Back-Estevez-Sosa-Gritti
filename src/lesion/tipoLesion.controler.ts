import { Request, Response } from "express"
import { orm } from "../shared/db/orm.js";
import { tipoLesion } from "./tipoLesion.entity.js";
import { t } from "@mikro-orm/core";

const em= orm.em

async function findAll(req:Request, res:Response) {
    try {
        const tipoLesiones =  await em.find(tipoLesion, {})
        res
         .status(200)
        .json({message: 'Encontrar los tipos de lesion', data: tipoLesiones})
    } catch (error:any) {
        res.status(500).json({message: error.message})
        
    }
}
async function findOne(req:Request,res:Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tipoLesiones = await em.findOneOrFail(tipoLesion,{id})
        res.status(200).json({message: 'Tipo de lesion encontrado', data: tipoLesiones})
    }
    catch (error:any) {
        if (error.name==='NotFoundError'){
            res.status(404).json({message: 'Tipo de lesion no encontrado'})
        } else {
            res.status(500).json({message: 'Error interno del servidor', error: error.message})
        }
}  }

async function add(req:Request, res:Response) {
  try {
    const tipoLesiones =em.create(tipoLesion, req.body)
    await em.flush()
    res.status(201).json({message: 'Tipo de lesion creado', data: tipoLesiones});
}
catch (error:any) {
    res.status(500).json({message: 'Error interno del servidor', error: error.message})
}
}

async function update (req:Request, res:Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const lesion = await em.findOne(tipoLesion, { id });
        if (!lesion) {
            res.status(404).json({ message: 'Tipo de lesion no encontrado' });
            return;
        }
        em.assign(lesion, req.body);
        await em.flush();
        res.status(200).json({ message: 'Tipo de lesion actualizada', data: lesion });
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}


async function remove(req:Request, res:Response){
    try {
    const id = Number.parseInt(req.params.id)
    const tipoLesiones = em.getReference(tipoLesion, id)
    await em.removeAndFlush(tipoLesiones)
    res.status(200).send({ message: 'Tipo de lesion eliminada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
    

export { findAll, findOne, add, update, remove }