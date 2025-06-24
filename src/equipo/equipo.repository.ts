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

    public findAll(): Equipo[] | undefined {
        return equipos
    }
    public findOne(item: { id: string }): Equipo | undefined {
       return equipos.find((equipo) => equipo.id === item.id)
    }
    public add(item: Equipo): Equipo | undefined {
        equipos.push(item)
        return item
    }

    public update(item: Equipo): Equipo | undefined {
        const equipoIdx = equipos.findIndex((equipo) => equipo.id===item.id)
        if (equipoIdx!==-1){
           equipos[equipoIdx]={... equipos[equipoIdx], ...item} 
        }
        return equipos[equipoIdx]
    }
    public delete(item: { id: string; }): Equipo | undefined {
         const equipoIdx = equipos.findIndex((equipo) => equipo.id === item.id)
    if(equipoIdx !== -1){
        const deletedEquipos= equipos[equipoIdx]
        equipos.splice(equipoIdx, 1)
        return deletedEquipos
        } 

    }
}