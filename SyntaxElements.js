import * as Expresion from "./Expresion.js";

export class Comando {

    constructor(comando){
        this.comando =  comando;
    }

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
    constructor(name, value, dataType){
        this.name = name;
        this.value = value;
        this.dataType = dataType;
    }

 
    toString(){
        return "Asignacion \n" + "Nombre Variable: " + this.name.toString() + ", Valor Asignado: " + this.value.toString();
    }

    toJava(emitter){
        console.log("Asignando en Java")
        let assignedDataType = "";
        if (this.dataType != undefined){
            assignedDataType = this.dataType + " ";
        }
        return "\t\t" + assignedDataType + this.name + " = " + this.value.toExpresion(emitter) +  ";"
    }

  
}
export class Creacion{
    constructor(name, value, dataType){
        this.name = name;
        this.value = value;
    }

    toString(){
        return "Creacion \n" + "Nombre Variable: " + this.name.toString() + ", Valor Asignado: " + this.value.toString();
    }
    
    toJava(emitter){
        console.log("Creando en Java");
        console.log(this.value)
        let assignedDataType = "Object ";
        if (this.dataType != undefined){
            assignedDataType = this.dataType;
        }
        return "\t\t" + assignedDataType + this.name + " = " + this.value.toExpresion(emitter) +  ";"
    }
}
export class Ciclo{}
export class Condicional{}

export class Impresion{
    constructor(valorAImprimir){
        this.valorAImprimir = valorAImprimir;
        this.valorFinal;

        // if (this.valorAImprimir instanceof Expresion.BINARY){
        //     this.valorFinal = this.valorAImprimir.firstOperand.value
        // }

        console.log("xd");
        console.log(this.valorAImprimir);
        // console.log(this.valorAImprimir.firstOperand);
        // console.log(this.valorAImprimir.secondOperand);
    }
    toJava(){
        return "\t\tSystem.out.println(" + this.valorAImprimir.concatenate() +");";
    }

    toString(){
        return "Impresion: \n" + "Valor a Imprimir: " + this.valorAImprimir.toString();
    }

}
export class Metodo{}
export class Operacion{}
export class Acceso{}