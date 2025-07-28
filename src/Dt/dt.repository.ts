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

    public findAll(): Dt[] | undefined {
        return dts
    }
    public findOne(item: { id: string }): Dt | undefined {
       return dts.find((dt) => dt.id === item.id)
    }
    public add(item: Dt): Dt | undefined {
        dts.push(item)
        return item
    }

    public update(item: Dt): Dt | undefined {
        const dtIdx = dts.findIndex((dt) => dt.id===item.id)
        if (dtIdx!==-1){
           dts[dtIdx]={... dts[dtIdx], ...item} 
        }
        return dts[dtIdx]
    }
    public delete(item: { id: string; }): Dt | undefined {
         const dtIdx = dts.findIndex((dt) => dt.id === item.id)
    if(dtIdx !== -1){
        const deletedDts= [dtIdx]
        dts.splice(dtIdx, 1)
        deletedDts
        return
        } 

    }
}