import {Entity, Property, ManyToOne, Rel} from '@mikro-orm/core'
import { BaseEntity } from "../shared/db/baseEntity.js"; 
import { Jugador } from './jugador.entity.js'; 


@Entity()
export class EstadisticaJugador extends BaseEntity {
    @Property({nullable: false})
    temporada!: number

    @Property({nullable: false})
    goles!: number

    @Property({nullable: false})
    asistencias!: number

    @Property({nullable: false})
    amarillas!: number

    @Property({nullable: false})
    rojas!: number

    @ManyToOne(() => Jugador)
    jugador!: Rel<Jugador>;
}