import crypt from 'node:crypto'

export class tipoLesion {
    constructor(        
        public cdTipoLesion:string, 
        public descTipoLesion:string,
        public diasRecuperacion:string,
        public tratamiento:string) 
        {}
}