import {Entity, OneToMany, Property, Cascade, Collection, ManyToMany} from '@mikro-orm/core'
import { BaseEntity } from "../shared/db/baseEntity.js"; // Importación corregida
/*import { equipo } from "./equipo.entity.js" */
/*import { partido } from "../partido/partido.entity.js" */
import { Contrato } from "../contrato/contrato.entity.js" 
import { Lesion } from "../lesion/lesion.entity.js" 

@Entity()
export class Jugador extends BaseEntity {
    @Property({nullable: false})
    nombre!: string

    @Property({nullable: false})
    apellido!: string

    @Property({nullable: false, unique: true})
    dni!: string

    @Property({nullable: false})
    edad!: string
    @Property({nullable: false})
    numero!: string
    @Property({nullable: false})
    posicion!: string

    @OneToMany(()=>Contrato, contrato => contrato.jugador, {cascade:[Cascade.ALL]})
    contratos = new Collection<Contrato>(this)
    @OneToMany(()=>Lesion, lesion => lesion.jugador, {cascade:[Cascade.ALL]})
    lesiones = new Collection<Lesion>(this)
}