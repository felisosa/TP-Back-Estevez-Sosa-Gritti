import { Repository } from "../shared/repository.js";
import { Equipo } from "./equipos.js";
import { pool } from "../shared/db/conm.mysql.js";
import { ResultSetHeader, RowDataPacket } from 'mysql2';
 
const equipos = [
    new Equipo (
        'Gimnasia',
        'LPF',
        'Argentina',
        'Primera A',
    )
]
export class EquipoRepository implements Repository<Equipo>{

    public async findAll(): Promise<Equipo[] | undefined >{
       const [equipos]= await pool.query('select * from equipo')
       return equipos as Equipo[]
       
    }
    public async findOne(item: { id: string }): Promise<Equipo | undefined >{
        const id = Number.parseInt(item.id)
        const [equipos]= await pool.query<RowDataPacket[]>('select * from equipo where id_equipo = ?',
        [id])
        if (equipos.length === 0){
            return undefined
        }
        const equipo = equipos[0] as Equipo
        
        return equipo 
    }
    public async add(item: Equipo): Promise<Equipo | undefined> {
       throw new Error('not implemented');
    }

    public async update(id: string,item: Equipo): Promise<Equipo | undefined >{
        throw new Error('not implemented');
    }
    public async delete(item: { id: string; }): Promise<Equipo | undefined >{
        throw new Error('not implemented');
    }
}