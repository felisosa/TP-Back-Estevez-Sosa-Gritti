import {Entity, OneToMany, Property, Cascade, Collection, ManyToOne, Rel} from '@mikro-orm/core'
import { BaseEntity } from "../shared/db/baseEntity.js"; // Importación corregida
import { Jugador } from '../jugador/jugador.entity.js';
/*import { Partido } from "../partido/partido.entity.js" */
/*import { Jugador } from "../jugador/jugador.entity.js" */
import { tipoLesion } from "./tipoLesion.entity.js" 

@Entity()
export class Lesion extends BaseEntity {
    @Property({nullable: false, unique: true})
    cdLesion!: string

    @Property({nullable: false})
    descLesion!: string

    @ManyToOne(()=>Jugador)
    jugador!: Rel<Jugador>;

    @ManyToOne(()=> tipoLesion, {cascade:[Cascade.ALL]})
    tipoLesiones = new Collection<tipoLesion>(this);
    
}