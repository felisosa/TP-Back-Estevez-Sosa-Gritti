import { Repository } from "../shared/repository.js";
import { Partido } from "./partidos.js";

const partidos = [
    new Partido (
        '01/01/2025',
        'amistoso',
        '19:30',
        'Buenos Aires',
        'San Lorenzo',
        '1',
        'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
    )
]
export class PartidoRepository implements Repository<Partido>{

    public findAll(): Partido[] | undefined {
        return partidos
    }
    public findOne(item: { id: string }): Partido | undefined {
       return partidos.find((partido) => partido.id === item.id)
    }
    public add(item: Partido): Partido | undefined {
        partidos.push(item)
        return item
    }

    public update(item: Partido): Partido | undefined {
        const partidoIdx = partidos.findIndex((partido) => partido.id===item.id)
        if (partidoIdx!==-1){
           partidos[partidoIdx]={... partidos[partidoIdx], ...item} 
        }
        return partidos[partidoIdx]
    }
    public delete(item: { id: string; }): Partido | undefined {
         const partidoIdx = partidos.findIndex((partido) => partido.id === item.id)
    if(partidoIdx !== -1){
        const deletedPartidos= partidos[partidoIdx]
        partidos.splice(partidoIdx, 1)
        return deletedPartidos
        } 

    }
}