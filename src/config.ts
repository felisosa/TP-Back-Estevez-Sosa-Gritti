const { PORT = 3000, JWT_SECRET: RAW_JWT_SECRET } = process.env

if (!RAW_JWT_SECRET) {
    throw new Error('Falta JWT_SECRET en las variables de entorno. Copiá .env.example a .env y completalo.')
}

export const JWT_SECRET: string = RAW_JWT_SECRET
export { PORT }