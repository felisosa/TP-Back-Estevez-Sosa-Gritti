import { Repository } from "../shared/repository.js";
import { Equipo } from "./equipos.js";

const equipos = [
    new Equipo (
        'Gimnasia',
        'LPF',
        'Argentina',
        'Primera A',
        'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
    )
]
export class EquipoRepository implements Repository<Equipo>{

    public async findAll(): Promise<Equipo[] | undefined >{
        return await equipos
    }
    public async findOne(item: { id: string }): Promise<Equipo | undefined >{
       return await equipos.find((equipo) => equipo.id === item.id)
    }
    public async add(item: Equipo): Promise<Equipo | undefined> {
        await equipos.push(item)
        return item
    }

    public async update(id: string,item: Equipo): Promise<Equipo | undefined >{
        const equipoIdx = await equipos.findIndex((equipo) => equipo.id===item.id)
        if (equipoIdx!==-1){
           equipos[equipoIdx]={... equipos[equipoIdx], ...item} 
        }
        return equipos[equipoIdx]
    }
    public async delete(item: { id: string; }): Promise<Equipo | undefined >{
         const equipoIdx = await equipos.findIndex((equipo) => equipo.id === item.id)
    if(equipoIdx !== -1){
        const deletedEquipos= equipos[equipoIdx]
        equipos.splice(equipoIdx, 1)
        return deletedEquipos
        } 

    }
}