import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js";
import { Equipo } from "./equipo.entity.js"
const em= orm.em

function sanitizeEquipoInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput={    
        nombre: req.body.nombre,
        liga: req.body.liga,
        pais: req.body.pais,
        categoria: req.body.categoria
    }

    Object.keys(req.body.sanitizedInput).
    forEach((key)=> {
        if(req.body.sanitizedInput[key]===undefined){delete req.body.sanitizedInput[key]}
    })
    next()

}

async function findAll(req:Request, res:Response): Promise<void> {
    try {
        // Allow optional filtering by categoria via query string: /api/equipos?categoria=Primera
        const { categoria } = req.query;
        const where: any = {};
        if (categoria) {
            where.categoria = String(categoria);
        }
        const equipos = await em.find(Equipo, where)
        res.status(200).json({message: 'Equipos', data: equipos})
    } catch (error:any) {
        res.status(500).json({message: error.message})
    }
}
async function findOne(req:Request,res:Response): Promise<void> {
   try {
           const id = Number.parseInt(req.params.id)
           const equipo = await em.findOneOrFail(Equipo, {id})
           res.status(200).json({message: 'Equipo encontrado', data: equipo})
       } catch (error:any) {
           if (error.name==='NotFoundError'){
               res.status(404).json({message: 'Equipo no encontrado'});
               return;
           }
           res.status(500).json({message: 'Error interno del servidor', error: error.message});
       }
}  

async function add(req:Request, res:Response): Promise<void> {
  try {
          const payload = req.body.sanitizedInput ?? req.body;
          const equipo = em.create(Equipo, payload)
          await em.flush()
          res.status(201).json({message: 'Equipo creado', data: equipo})
      } catch (error:any) {
          res.status(500).json({message: 'Error interno del servidor', error: error.message})
      }
}

async function update (req:Request, res:Response): Promise<void> {
    try {
            const id = Number.parseInt(req.params.id);
            const equipo = await em.findOne(Equipo, { id });
            if (!equipo) {
                res.status(404).json({ message: 'Equipo no encontrado' });
                return;
            }
            const payload = req.body.sanitizedInput ?? req.body;
            em.assign(equipo, payload);
            await em.flush();
            res.status(200).json({ message: 'Equipo actualizado', data: equipo });
        } catch (error:any) {
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
}


async function remove(req:Request, res:Response): Promise<void> {
     try {
            const id = Number.parseInt(req.params.id)
            const equipo = await em.findOne(Equipo, { id })
            if (!equipo) {
                res.status(404).json({ message: 'Equipo no encontrado' })
                return;
            }
            await em.removeAndFlush(equipo)
            res.status(200).json({ message: 'Equipo eliminado' })
        } catch (error:any) {
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }

export { sanitizeEquipoInput, findAll, findOne, add, update, remove }