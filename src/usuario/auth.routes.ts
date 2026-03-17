import { Router, type RequestHandler } from 'express'
import { sanitizeAuthInput, register, login } from './auth.controler.js'

export const authRouter = Router()

const asyncHandler = (fn: any): RequestHandler => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

authRouter.post('/register', sanitizeAuthInput as RequestHandler, asyncHandler(register))
authRouter.post('/login', sanitizeAuthInput as RequestHandler, asyncHandler(login))
