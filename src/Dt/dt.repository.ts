import { Repository } from "../shared/repository.js";
import { Dt } from "./dts.js";

const dts = [
    new Dt (
        'marcelo',
        'gallardo',
        '23456789',
        '50',
        'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
    )
]
export class DtRepository implements Repository<Dt>{

    public   async findAll(): Promise<Dt [] | undefined >{
        throw new Error('not implemented')
    }
    public async findOne(item: { id: string }): Promise<Dt | undefined >{
       return await dts.find((dt) => dt.id === item.id)
    }
    public async add(item: Dt): Promise<Dt | undefined> {
        throw new Error('not implemented')
    }

    public async update(id:string, item: Dt): Promise <Dt | undefined> {
        throw new Error('not implemented')
    }
    public async delete(item: { id: string; }): Promise<Dt | undefined> {
     throw new Error('not implemented')

    }
}