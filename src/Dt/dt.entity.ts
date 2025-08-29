import {Entity, OneToMany, Property, Cascade, Collection} from '@mikro-orm/core'
import { BaseEntity } from "../shared/db/baseEntity";
/*import { equipo } from "./equipo.entity.js" */
/*import { partido } from "../partido/partido.entity.js" */
import { Contrato } from "../contrato/contrato.entity.js" 

@Entity()
export class Dt extends BaseEntity {
    @Property({nullable: false})
    nombre!: string

    @Property({nullable: false})
    apellido!: string

    @Property({nullable: false, unique: true})
    dni!: string

    @Property({nullable: false})
    edad!: string

    @OneToMany(()=>Contrato, contrato => contrato.dts, {cascade:[Cascade.ALL]})
        contratos = new Collection<Contrato>(this);
}