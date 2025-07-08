import crypt from 'node:crypto'

export class Partido {
    constructor(        
        public fecha:string, 
        public tipo:string, 
        public horario:string, 
        public lugar:string,
        public rival:string,
        public nroFecha: string,
        public id = crypto.randomUUID()) 
        {}
}