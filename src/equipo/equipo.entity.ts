import {Entity, OneToMany, Property, Cascade, Collection, ManyToMany, ManyToOne, Rel} from '@mikro-orm/core'
import { BaseEntity } from "../shared/db/baseEntity.js"; // Importacion corregida
/*import { equipo } from "./equipo.entity.js" */
import { Partido } from "../partido/partido.entity.js" 
import { Contrato } from "../contrato/contrato.entity.js" 

@Entity()
export class Equipo extends BaseEntity {
    @Property({nullable: false, unique: true})
    nombre!: string

    @Property({nullable: false})
    categoria!: string

    @Property({nullable: false})
    liga!: string

    @Property({nullable: false})
    pais!: string

    @OneToMany(()=>Partido, partido => partido.equipo, {cascade:[Cascade.ALL]})
    partidos = new Collection<Partido>(this); // Declaracion de la propiedad "partidos"
    @OneToMany(()=>Contrato, contrato => contrato.equipos, {cascade:[Cascade.ALL]})
    contratos = new Collection<Contrato>(this); // Declaracion de la propiedad "contratos"
     

}