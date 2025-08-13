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

    public async findAll(): Promise< Partido[] | undefined> {
        return await partidos
    }
    public async findOne(item: { id: string }): Promise<Partido | undefined> {
       return await partidos.find((partido) => partido.id === item.id)
    }
    public async add(item: Partido):Promise< Partido | undefined >{
       await partidos.push(item)
        return item
    }

    public async update(id:string,item: Partido): Promise <Partido | undefined >{
        const partidoIdx = await partidos.findIndex((partido) => partido.id===item.id)
        if (partidoIdx!==-1){
           partidos[partidoIdx]={... partidos[partidoIdx], ...item} 
        }
        return partidos[partidoIdx]
    }
    public async delete(item: { id: string; }): Promise <Partido | undefined> {
         const partidoIdx = await partidos.findIndex((partido) => partido.id === item.id)
    if(partidoIdx !== -1){
        const deletedPartidos= partidos[partidoIdx]
        partidos.splice(partidoIdx, 1)
        return deletedPartidos
        } 

    }
}