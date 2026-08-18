import {Entity, OneToMany, Property, Cascade, Collection,ManyToOne, Rel} from '@mikro-orm/core'
import { BaseEntity } from "../shared/db/baseEntity.js"; // Importación corregida
import { Equipo } from "../equipo/equipo.entity.js" 
import { Dt } from "../Dt/dt.entity.js" 
import { Jugador } from "../jugador/jugador.entity.js" 
@Entity()
export class Contrato extends BaseEntity {
    @Property({nullable: false, unique: true})
    cdContrato!: string

    @Property({nullable: false})
    fechaIni!: string

    @Property()
    fechaFin!: string

    @Property({nullable: true})
    fechaRealFin!: string

    @ManyToOne(()=>Dt)
    dt!: Rel<Dt>;

    @ManyToOne(()=> Jugador)
    jugador!: Rel<Jugador>;

    @ManyToOne(()=> Equipo)
    equipo!: Rel<Equipo>;

}