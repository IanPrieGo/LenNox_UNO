export class Comando {

    constructor(comando){
        this.comando =  comando;
    }

}

export class Expresion {

}

export class Igualdad {

}

export class Diferenciacion {

}

export class SumRes {

}

export class DivMul {
    
}

export class Negacion {

}

export class Primaria {
   
}

export class Asignacion{
    constructor(name, value){
        this.name = name;
        this.value = value;
    }

 
    toString(){
        return "Asignacion \n" + "Nombre Variable: " +this.name.toString() + ", Valor Asignado: " + this.value.toString();
    }
}
export class Creacion{
    constructor(name, value){
        this.name = name;
        this.value = value;
    }

    toString(){
        return "Creacion \n" + "Nombre Variable: " +this.name.toString() + ", Valor Asignado: " + this.value.toString();
    }
}
export class Ciclo{}
export class Condicional{}

export class Impresion{
    constructor(valorAImprimir){
        this.valorAImprimir = valorAImprimir;
    }

    toString(){
        return "Impresion: \n" + "Valor a Imprimir: " + this.valorAImprimir.toString();
    }
}
export class Metodo{}
export class Operacion{}
export class Acceso{}