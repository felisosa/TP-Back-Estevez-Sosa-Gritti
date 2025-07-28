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

    public findAll(): Jugador[] | undefined {
        return jugadores
    }
    public findOne(item: { id: string }): Jugador | undefined {
       return jugadores.find((jugador) => jugador.id === item.id)
    }
    public add(item: Jugador): Jugador | undefined {
        jugadores.push(item)
        return item
    }

    public update(item: Jugador): Jugador | undefined {
        const jugadorIdx = jugadores.findIndex((jugador) => jugador.id===item.id)
        if (jugadorIdx!==-1){
           jugadores[jugadorIdx]={... jugadores[jugadorIdx], ...item} 
        }
        return jugadores[jugadorIdx]
    }
    public delete(item: { id: string; }): Jugador | undefined {
         const jugadorIdx = jugadores.findIndex((jugador) => jugador.id === item.id)
    if(jugadorIdx !== -1){
        const deletedJugadores= [jugadorIdx]
        jugadores.splice(jugadorIdx, 1)
        deletedJugadores
        return
        } 

    }
}