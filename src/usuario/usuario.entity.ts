import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.js'

@Entity()
export class Usuario extends BaseEntity {
    @Property({ nullable: false, unique: true })
    email!: string

    @Property({ nullable: false, hidden: true })
    password!: string

    @Property({ nullable: false, default: 'user' })
    rol!: string
}
