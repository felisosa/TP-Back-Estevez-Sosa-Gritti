import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../config.js'

export interface JwtPayload {
  id: number
  email: string
  rol: 'jugador' | 'dt'
  jugadorId?: number
  dtId?: number
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export function readAuthTokenFromCookies(req: Request): string | null {
  const cookieHeader = req.headers.cookie
  if (!cookieHeader) return null

  const tokenCookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('auth_token='))

  if (!tokenCookie) return null
  return decodeURIComponent(tokenCookie.slice('auth_token='.length))
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  const token = bearerToken || readAuthTokenFromCookies(req)

  if (!token) {
    res.status(401).json({ message: 'Token no proporcionado' })
    return
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload
    req.user = payload
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

export function soloRol(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.rol)) {
      res.status(403).json({ message: 'No tenés permiso para esta acción' })
      return
    }
    next()
  }
}