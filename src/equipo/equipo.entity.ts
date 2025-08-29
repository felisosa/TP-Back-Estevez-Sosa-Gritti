import {Entity, OneToMany, Property, Cascade, Collection} from '@mikro-orm/core'
import { BaseEntity } from "../shared/db/baseEntity";
/*import { equipo } from "./equipo.entity.js" */
import { Partido } from "../partido/partido.entity.js" 
import { Contrato } from "../contrato/contrato.entity.js" 

@Entity()
export class Equipo extends BaseEntity {
    @Property({nullable: false, unique: true})
    nombre!: string

    @Property()
    categoria!: string

    @Property()
    liga!: string

    @Property()
    pais!: string

    @OneToMany(()=>Partido, partido => partido.equipo, {cascade:[Cascade.ALL]},)
    partidos = new Collection<Partido>(this); // Declaración de la propiedad "partidos"
    @OneToMany(()=>Contrato, contrato => contrato.equipos, {cascade:[Cascade.ALL]})
    contratos = new Collection<Contrato>(this); // Declaración de la propiedad "contratos"
     

}