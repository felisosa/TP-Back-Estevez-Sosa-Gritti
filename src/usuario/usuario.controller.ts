import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { orm } from '../shared/db/orm.js'
import { Usuario, Rol } from './usuario.entity.js'
import { Jugador } from '../jugador/jugador.entity.js'
import { Dt } from '../Dt/dt.entity.js'
import { usuarioRepository } from './usuario.repository.js'
import { JWT_SECRET } from '../config.js'
import { readAuthTokenFromCookies } from '../shared/middleware/auth.middleware.js'

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, rol, nombre, apellido, dni, edad, numero, posicion } = req.body

  // Validaciones básicas
  if (!email || !password || !rol || !nombre || !apellido || !dni || !edad) {
    res.status(400).json({ message: 'Faltan campos obligatorios: email, password, rol, nombre, apellido, dni, edad' })
    return
  }

  if (!Object.values(Rol).includes(rol)) {
    res.status(400).json({ message: 'El rol debe ser "jugador" o "dt"' })
    return
  }

  if (rol === Rol.JUGADOR && (!numero || !posicion)) {
    res.status(400).json({ message: 'Para rol jugador se requiere numero y posicion' })
    return
  }

  const existe = await usuarioRepository.findByEmail(email)
  if (existe) {
    res.status(409).json({ message: 'Ya existe un usuario con ese email' })
    return
  }

  try {
    const fork = orm.em.fork()
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el perfil según el rol
    let jugador: Jugador | undefined
    let dt: Dt | undefined

    if (rol === Rol.JUGADOR) {
      jugador = fork.create(Jugador, { nombre, apellido, dni, edad, numero, posicion })
    } else {
      dt = fork.create(Dt, { nombre, apellido, dni, edad })
    }

    // Crear el usuario vinculado al perfil
    const usuario = fork.create(Usuario, {
      email,
      password: hashedPassword,
      rol,
      ...(jugador ? { jugador } : {}),
      ...(dt ? { dt } : {}),
    })

    await fork.persistAndFlush(usuario)

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol, jugadorId: jugador?.id, dtId: dt?.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    })

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      data: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        perfil: jugador ?? dt,
      },
    })
    return
  } catch (error: any) {
    // DNI duplicado u otro constraint de la BD
    if (error?.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Ya existe un jugador/DT con ese DNI' })
      return
    }
    res.status(500).json({ message: 'Error al registrar usuario', error })
    return
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: 'email y password son requeridos' })
    return
  }

  try {
    // Traemos el usuario con su perfil incluido
    const usuario = await orm.em.fork().findOne(
      Usuario,
      { email },
      { populate: ['jugador', 'dt'] }
    )

    if (!usuario) {
      res.status(401).json({ message: 'Credenciales inválidas' })
      return
    }

    const passwordValida = await bcrypt.compare(password, usuario.password)
    if (!passwordValida) {
      res.status(401).json({ message: 'Credenciales inválidas' })
      return
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol, jugadorId: usuario.jugador?.id, dtId: usuario.dt?.id },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    })

    res.status(200).json({
      message: 'Login exitoso',
      rol: usuario.rol,
      perfil: usuario.jugador ?? usuario.dt ?? null,
    })
    return
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error })
    return
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  })

  res.status(200).json({ message: 'Logout exitoso' })
}

export async function session(req: Request, res: Response): Promise<void> {
  const token = readAuthTokenFromCookies(req)

  if (!token) {
    res.status(401).json({ authenticated: false })
    return
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: number
      email: string
      rol: string
    }

    res.status(200).json({
      authenticated: true,
      user: {
        id: payload.id,
        email: payload.email,
        rol: payload.rol,
      },
    })
    return
  } catch {
    res.status(401).json({ authenticated: false })
    return
  }
}