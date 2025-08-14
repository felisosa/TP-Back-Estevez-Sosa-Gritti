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
        throw new Error ('not implemented')
    }
    public async findOne(item: { id: string }): Promise<Partido | undefined> {
       throw new Error ('not implemented')
    }
    public async add(item: Partido):Promise< Partido | undefined >{
       throw new Error ('not implemented')
    }

    public async update(id:string,item: Partido): Promise <Partido | undefined >{
        throw new Error ('not implemented')
    }
    public async delete(item: { id: string; }): Promise <Partido | undefined> {
         throw new Error ('not implemented')
        } 
    }