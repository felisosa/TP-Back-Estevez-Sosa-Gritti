import crypt from 'node:crypto'

export class Jugador{
  constructor(
    public nombre: string,
    public apellido: string,
    public dni: string,
    public edad: string,
    public numero: string,
    public posicion:string,
    public id = crypto.randomUUID())
    {}
  } 