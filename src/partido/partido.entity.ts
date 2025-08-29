import {Entity, OneToMany, Property, Cascade, Collection, ManyToOne} from '@mikro-orm/core'
import { BaseEntity } from "../shared/db/baseEntity";
import { Equipo } from "../equipo/equipo.entity" 
/*import { partido } from "../partido/partido.entity.js" */

@Entity()
export class Partido extends BaseEntity {
    @Property({nullable: false, unique: true})
    tipo!: string

    @Property({nullable: false})
    nroFecha!: string

    @Property({nullable: false})
    rival!: string

    @Property({nullable: false})
    fecha!: string

    @Property({nullable: false})
    horario!: string

    @Property({nullable: false})
    lugar!: string

    @ManyToOne(()=> Equipo, {cascade:[Cascade.ALL]})
     
    equipo!: Equipo;
}