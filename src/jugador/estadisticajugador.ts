import crypt from 'node:crypto'

export class tipoLesion {
    constructor(        
        public temporada:number, 
        public goles:number,
        public asistencias:number,
        public amarillas:number,
        public rojas:number) 
        {}
}