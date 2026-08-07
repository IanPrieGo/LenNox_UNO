import * as Expresion from "./Expresion.js";
import * as TokenType from "./TokenTypes.js";
import {Token} from "./Token.js";

export class Condicional {
    constructor(condicion, comandos, condicionalAlternativo){
        this.condicion = condicion;
        this.comandos = comandos;
        this.condicionalAlternativo = condicionalAlternativo;
    }

    toString(){
        return `Condicional\n Condicion sin Evaluar: ${this.condicion}, \nComandos Integrados:${this.comandos}, \nCondicional Alternativo: ${this.condicionalAlternativo}`;
    }

    toJava(emitter){
        let condicionFinal;
        if (this.condicion.token.type == TokenType.VERDAD ) {
            condicionFinal = true;
        } else if (this.condicion.token.type == TokenType.FALSO) {
            condicionFinal = false;
        } else {
            condicionFinal = this.condicion.token.lexeme;
        }
        return "\t\tif(" + condicionFinal + "){\n\t\t" + this.comandos.toJava(emitter) + "\n\t\t}"
    }
}

export class Asignacion{
    constructor(name, value, dataType){
        this.name = name;
        this.value = value;
        this.dataType = dataType;
    }

 
    toString(){
        let value;
        if (this.value ==  "nul"){
            value = null;
        } else if(this.value == "ver"){
            value = true;
        }if(this.value == "fal"){
            value = false;
        } else {
            value = this.value.toString()
        }
        return "Asignacion \n" + "Nombre Variable: " + this.name.toString() + ", Valor Asignado: " + this.value.toString();
    }

    toJava(emitter){
        // emitter.logs.push("Asignando en Java")
        // let assignedDataType = "";
        // if (this.dataType != undefined){
        //     assignedDataType = this.dataType + " ";
        // }
        // emitter.logs.push(`Nombre: ${this.name}, Valor: ${this.value}`)
        // return "\t\t" + assignedDataType + this.name + " = " + this.value.toExpresion(emitter) +  ";"
        return "a";
    }

  
}
export class Creacion{
    constructor(name, value, dataType){
        this.name = name;
        this.value = value;
    }

    toString(){
        let value;
        if (this.value == null) {
            value = "null"
        } else if(this.value == "Verdad"){
            value = "true";
        }else {
            value = this.value.toString()
        }
        return "Creacion \n" + "Nombre Variable: " + this.name.toString() + ", Valor Asignado: " + value;
    }
    
    toJava(emitter){
        emitter.logs.push("Creando en Java");
        emitter.logs.push(this.value)
        let assignedDataType = "Object ";
        if (this.dataType != undefined){
            assignedDataType = this.dataType;
        }

        if (this.value == null) return "\t\t" + assignedDataType + this.name + ";"; 
        return "\t\t" + assignedDataType + this.name + " = " + this.value.toExpresion(emitter) +  ";"
    }
}
export class Ciclo{}

export class Impresion{
    constructor(valorAImprimir){
        this.valorAImprimir = valorAImprimir;
        this.valorFinal;
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