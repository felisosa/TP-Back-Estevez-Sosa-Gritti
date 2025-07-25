import crypt from 'node:crypto'

export class Persona {
  public nombre: string;
  public apellido: string;
  public dni: string;
  public edad: string;
  public id = crypto.randomUUID();
  public numero?: string; // Declara 'numero' como opcional

  constructor(
    public tipo: string, // 'tipo' debería ser una propiedad de la clase si la usas fuera del constructor
    nombre: string,
    apellido: string,
    dni: string,
    edad: string,
    numero?: string // También puedes pasarlo como parámetro opcional al constructor
  ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.edad = edad;

    if (tipo === "jugador") {
      this.numero = numero; // Asigna el valor si es un jugador
    }
  }
}