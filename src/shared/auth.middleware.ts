import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? (() => {
    console.warn('WARNING: JWT_SECRET env variable is not set. Using an insecure default. Set JWT_SECRET in production.')
    return 'secret_key_change_in_production'
})()

export interface AuthRequest extends Request {
    user?: { id: number; email: string; rol: string }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
        res.status(401).json({ message: 'Token de autenticación requerido' })
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; rol: string }
        req.user = decoded
        next()
    } catch {
        res.status(401).json({ message: 'Token inválido o expirado' })
    }
}
