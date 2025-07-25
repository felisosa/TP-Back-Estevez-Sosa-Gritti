import { Repository } from "../shared/repository.js";
import { Persona } from "./personas.js";

const personas = [
    new Persona (
        'Jugador',
        'Angel',
        'Di Maria',
        '46216407',
        '37',
        'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
    )
]
export class PersonaRepository implements Repository<Persona>{

    public findAll(): Persona[] | undefined {
        return personas
    }
    public findOne(item: { id: string }): Persona | undefined {
       return personas.find((persona) => persona.id === item.id)
    }
    public add(item: Persona): Persona | undefined {
        personas.push(item)
        return item
    }

    public update(item: Persona): Persona | undefined {
        const personaIdx = personas.findIndex((persona) => persona.id===item.id)
        if (personaIdx!==-1){
           personas[personaIdx]={... personas[personaIdx], ...item} 
        }
        return personas[personaIdx]
    }
    public delete(item: { id: string; }): Persona | undefined {
         const personaIdx = personas.findIndex((persona) => persona.id === item.id)
    if(personaIdx !== -1){
        const deletedPersonas= [personaIdx]
        personas.splice(personaIdx, 1)
        deletedPersonas
        return
        } 

    }
}