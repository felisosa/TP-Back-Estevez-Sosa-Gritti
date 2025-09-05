import {Entity, OneToMany, Property, Cascade, Collection,ManyToOne} from '@mikro-orm/core'
import { BaseEntity } from "../shared/db/baseEntity.js"; // Importación corregida
import { Equipo } from "../equipo/equipo.entity.js" 
import { Dt } from "../Dt/dt.entity.js" 
import { Jugador } from "../jugador/jugador.entity.js" 
@Entity()
export class Contrato extends BaseEntity {
    @Property({nullable: false, unique: true})
    fechaIni!: string

    @Property()
    fechaFin!: string

    @Property()
    fechaRealFin!: string

    @ManyToOne(()=>Dt, {cascade:[Cascade.ALL]},)
    dts = new Collection<Dt>(this); // Declaración de la propiedad "partidos"

    @ManyToOne(()=> Jugador, {cascade:[Cascade.ALL]},)
    jugadores = new Collection<Jugador>(this); // Declaración de la propiedad "partidos"

    @ManyToOne(()=> Equipo, {cascade:[Cascade.ALL]})
    equipos = new Collection<Equipo>(this); // Declaración de la propiedad "contratos"
     

}