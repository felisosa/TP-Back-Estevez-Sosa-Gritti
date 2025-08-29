import {Entity, OneToMany, Property, Cascade, Collection, ManyToMany, ManyToOne} from '@mikro-orm/core'
import { BaseEntity } from "../shared/db/baseEntity";
import { Jugador } from '../jugador/jugadores';
/*import { Partido } from "../partido/partido.entity.js" */
/*import { Jugador } from "../jugador/jugador.entity.js" */
import { tipoLesion } from "./tipoLesion.entity.js" 

@Entity()
export class Lesion extends BaseEntity {
    @Property({nullable: false, unique: true})
    cdLesion!: string

    @Property({nullable: false})
    descLesion!: string

    @ManyToMany(()=>Jugador, jugador => jugador.id, {cascade:[Cascade.ALL]},)
    jugadores = new Collection<Jugador>(this);

    @ManyToOne(()=> tipoLesion, {cascade:[Cascade.ALL]})
    tipoLesiones = new Collection<tipoLesion>(this);
    
}