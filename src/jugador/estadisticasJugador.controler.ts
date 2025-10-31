import { Request, Response } from "express"
import { orm } from "../shared/db/orm.js";
import { EstadisticaJugador } from "./estadisticaJugador.entity.js";
import { t } from "@mikro-orm/core";

const em= orm.em

async function findAll(req:Request, res:Response) {
    try {
        // populate the jugador relation so the frontend can show the jugador's name
        let estadisticas =  await em.find(EstadisticaJugador, {}, { populate: ['jugador'] })
        // optional filtering by jugadorNombre (partial, case-insensitive) via query string
        const { jugadorNombre } = req.query;
        if (jugadorNombre) {
            const q = String(jugadorNombre).toLowerCase();
            estadisticas = estadisticas.filter(s => {
                const j: any = (s as any).jugador;
                if (!j) return false;
                const full = `${String(j.nombre||'')} ${String(j.apellido||'')}`.toLowerCase();
                return full.includes(q) || String(j.nombre||'').toLowerCase().includes(q) || String(j.apellido||'').toLowerCase().includes(q);
            })
        }
        res.status(200).json({message: 'Encontrar las estadisticas de los jugadores', data: estadisticas})
    } catch (error:any) {
        res.status(500).json({message: error.message})
    }
}
async function findOne(req:Request,res:Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const estadistica = await em.findOneOrFail(EstadisticaJugador,{id})
        res.status(200).json({message: 'Estadistica de jugador encontrado', data: estadistica})
    } catch (error:any) {
        if (error.name==='NotFoundError'){
            res.status(404).json({message: 'Estadistica de jugador no encontrado'})
        } else {
            res.status(500).json({message: 'Error interno del servidor', error: error.message})
        }
    }
}

async function add(req:Request, res:Response) {
  try {
      const estadistica = em.create(EstadisticaJugador, req.body)
      await em.flush()
      res.status(201).json({message: 'Estadistica de jugador creado', data: estadistica});
  } catch (error:any) {
      res.status(500).json({message: 'Error interno del servidor', error: error.message})
  }
}

async function update (req:Request, res:Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const estadistica = await em.findOne(EstadisticaJugador, { id });
        if (!estadistica) {
            res.status(404).json({ message: 'Estadistica de jugador no encontrado' });
            return;
        }
        em.assign(estadistica, req.body);
        await em.flush();
        res.status(200).json({ message: 'Estadistica de jugador actualizada', data: estadistica });
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}


async function remove(req:Request, res:Response){
    try {
    const id = Number.parseInt(req.params.id)
    const estadistica = em.getReference(EstadisticaJugador, id)
    await em.removeAndFlush(estadistica)
    res.status(200).send({ message: 'Estadistica de jugador eliminada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
    

export { findAll, findOne, add, update, remove }