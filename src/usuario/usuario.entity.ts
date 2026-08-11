import { Entity, Property, Enum, OneToOne } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.js'
import { Jugador } from '../jugador/jugador.entity.js'
import { Dt } from '../Dt/dt.entity.js'

export enum Rol {
  JUGADOR = 'jugador',
  DT = 'dt',
}

@Entity()
export class Usuario extends BaseEntity {
  @Property({ nullable: false, unique: true })
  email!: string

  @Property({ nullable: false })
  password!: string

  @Enum(() => Rol)
  rol!: Rol

  @OneToOne(() => Jugador, { nullable: true, orphanRemoval: true })
  jugador?: Jugador

  @OneToOne(() => Dt, { nullable: true, orphanRemoval: true })
  dt?: Dt
}