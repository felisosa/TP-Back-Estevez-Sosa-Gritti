import crypt from 'node:crypto'

export class Dt{
  constructor(
    public nombre: string,
    public apellido: string,
    public dni: string,
    public edad: string,
    public id = crypto.randomUUID())
    {}
  } 