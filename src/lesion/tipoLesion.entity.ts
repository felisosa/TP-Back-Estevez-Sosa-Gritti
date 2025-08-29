import {Entity, OneToMany, Property, Cascade, Collection} from '@mikro-orm/core'
import { BaseEntity } from "../shared/db/baseEntity";
import { Jugador } from '../jugador/jugadores';
/*import { Partido } from "../partido/partido.entity.js" */
import { Lesion } from "../lesion/lesion.entity.js" 

@Entity()
export class tipoLesion extends BaseEntity {
    @Property({nullable: false, unique: true})
    cdTipoLesion!: string

    @Property({nullable: false})
    descTipoLesion!: string

    @Property({nullable: false})
    diasRecuperacion!: string

    @Property({nullable: false})
    tratamiento!: string

    @OneToMany(()=>Lesion, lesion => lesion.tipoLesiones, {cascade:[Cascade.ALL]},)
    jugadores = new Collection<Jugador>(this);
    
}