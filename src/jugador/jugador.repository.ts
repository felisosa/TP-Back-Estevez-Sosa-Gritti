import { Repository } from "../shared/repository.js";
import { Jugador } from "./jugadores.js";

const jugadores = [
    new Jugador (
        'Angel',
        'Di Maria',
        '46216407',
        '37',
        '11',
        'Ed',
        'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
    )
]
export class JugadorRepository implements Repository<Jugador>{

    public async findAll(): Promise<Jugador[] | undefined> {
        throw new Error('not implemented')
    }
    public async findOne(item: { id: string }): Promise<Jugador | undefined >{
       throw new Error('not implemented')
    }
    public async add(item: Jugador): Promise<Jugador | undefined> {
        throw new Error('not implemented')
    }

    public async update(id: string, item: Jugador): Promise<Jugador | undefined> {
        throw new Error('not implemented')
    }
    public async delete(item: { id: string; }): Promise<Jugador | undefined >{
         throw new Error('not implemented')

    }
}