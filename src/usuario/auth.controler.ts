import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { orm } from '../shared/db/orm.js'
import { Usuario } from './usuario.entity.js'

const em = orm.em
const JWT_SECRET = process.env.JWT_SECRET ?? (() => {
    console.warn('WARNING: JWT_SECRET env variable is not set. Using an insecure default. Set JWT_SECRET in production.')
    return 'secret_key_change_in_production'
})()
const SALT_ROUNDS = 10

function sanitizeAuthInput(req: Request, res: Response, next: NextFunction): void {
    req.body.sanitizedInput = {
        email: req.body.email,
        password: req.body.password,
        rol: req.body.rol,
    }

    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function register(req: Request, res: Response): Promise<void> {
    try {
        const { email, password, rol } = req.body.sanitizedInput

        if (!email || !password) {
            res.status(400).json({ message: 'Email y contraseña son requeridos' })
            return
        }

        const exists = await em.findOne(Usuario, { email })
        if (exists) {
            res.status(409).json({ message: 'El email ya está registrado' })
            return
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
        const usuario = em.create(Usuario, {
            email,
            password: hashedPassword,
            rol: rol ?? 'user',
        })
        await em.flush()

        res.status(201).json({ message: 'Usuario registrado', data: { id: usuario.id, email: usuario.email, rol: usuario.rol } })
    } catch (error: any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message })
    }
}

async function login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body.sanitizedInput

        if (!email || !password) {
            res.status(400).json({ message: 'Email y contraseña son requeridos' })
            return
        }

        const usuario = await em.findOne(Usuario, { email })
        if (!usuario) {
            res.status(401).json({ message: 'Credenciales inválidas' })
            return
        }

        const passwordValid = await bcrypt.compare(password, usuario.password)
        if (!passwordValid) {
            res.status(401).json({ message: 'Credenciales inválidas' })
            return
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '8h' }
        )

        res.status(200).json({ message: 'Login exitoso', token })
    } catch (error: any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message })
    }
}

export { sanitizeAuthInput, register, login }
