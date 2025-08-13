import crypt from 'node:crypto'

export class Equipo {
    constructor(        
        public nombre:string, 
        public liga:string, 
        public pais:string, 
        public categoria:string,
        public id ?: number) 
        {}
}