import { orm } from '../shared/db/orm.js'
import { Usuario } from './usuario.entity.js'

export const usuarioRepository = {
  async findByEmail(email: string): Promise<Usuario | null> {
    return orm.em.fork().findOne(Usuario, { email })
  },

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const fork = orm.em.fork()
    const usuario = fork.create(Usuario, data as Usuario)
    await fork.persistAndFlush(usuario)
    return usuario
  },
}