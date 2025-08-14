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
    public async add(equipoInput: Equipo): Promise<Equipo | undefined> {
       const {id, ...equipoRow}= equipoInput
       const [result]= await pool.query<ResultSetHeader>('insert into equipo set ?', [equipoRow])
       equipoInput.id=result.insertId
       return equipoInput
    }

    public async update(id: string,equipoInput: Equipo): Promise<Equipo | undefined >{
        const equipoId=Number.parseInt(id)
        const {id:_ ,...equipoRow}=equipoInput
        await pool.query('update equipo set ? where id_equipo = ?', [equipoRow, equipoId])
        return await this.findOne({id})
    }
    public async delete(item: { id: string; }): Promise<Equipo | undefined >{
        try {
        const equipoToDelete= await this.findOne(item)
        const equipoId = Number.parseInt(item.id)
        await pool.query('delete from equipo where id_equipo = ?', equipoId)
        return equipoToDelete}
    catch (error: any){
        throw new Error ('unable to delete team')}
}
}