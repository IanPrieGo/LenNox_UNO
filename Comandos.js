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

    transpilar(transpilador){
        return transpilador.transCondicional(this, transpilador);
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

    transpilar(transpilador){
        return transpilador.transAsignacion(this);
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

    transpilar(transpilador){
        return transpilador.transCreacion(this);
    }
    
}

export class Impresion{
    constructor(valorAImprimir){
        this.valorAImprimir = valorAImprimir;
        this.valorFinal;
    }

    transpilar(transpilador){
        return transpilador.transImpresion(this);
    }

    toString(){
        return "Impresion: \n" + "Valor a Imprimir: " + this.valorAImprimir.toString();
    }

}

export class Ciclo{}
export class Metodo{}
export class Operacion{}
export class Acceso{}