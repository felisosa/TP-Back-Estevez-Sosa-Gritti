import crypt from 'node:crypto'

export class Contrato {
  constructor(
    public fechaIni: string,
    public fechaFin: string,
    public fechaRealFin: string)
    {}
  } 