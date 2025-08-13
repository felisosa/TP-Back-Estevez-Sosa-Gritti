import { Repository } from "../shared/repository.js";
import { Jugador } from "./jugadores.js";

const jugadores = [
    new Jugador (
        'Angel',
        'Di Maria',
        '46216407',
        '37',
        '11',
        'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
    )
]
export class JugadorRepository implements Repository<Jugador>{

    public async findAll(): Promise<Jugador[] | undefined> {
        return await jugadores
    }
    public async findOne(item: { id: string }): Promise<Jugador | undefined >{
       return await jugadores.find((jugador) => jugador.id === item.id)
    }
    public async add(item: Jugador): Promise<Jugador | undefined> {
        await jugadores.push(item)
        return item
    }

    public async update(id: string, item: Jugador): Promise<Jugador | undefined> {
        const jugadorIdx = await jugadores.findIndex((jugador) => jugador.id===item.id)
        if (jugadorIdx!==-1){
           jugadores[jugadorIdx]={... jugadores[jugadorIdx], ...item} 
        }
        return jugadores[jugadorIdx]
    }
    public async delete(item: { id: string; }): Promise<Jugador | undefined >{
         const jugadorIdx = await jugadores.findIndex((jugador) => jugador.id === item.id)
    if(jugadorIdx !== -1){
        const deletedJugadores= [jugadorIdx]
        jugadores.splice(jugadorIdx, 1)
        deletedJugadores
        return
        } 

    }
}