import * as Expresion from "../Expresion.js";
import * as TokenType from "../TokenTypes.js";
import {Token} from "../Token.js";

export function transImpresion(comando){
    return "\t\tSystem.out.println(" + comando.valorAImprimir.concatenate() +");";
}

export function transAsignacion(comando){
    // emitter.logs.push("Asignando en Java")
    let assignedDataType = "";
    if (comando.dataType != undefined){
        assignedDataType = comando.dataType + " ";
    }
    // emitter.logs.push(`Nombre: ${comando.name}, Valor: ${comando.value}`)
    return "\t\t" + assignedDataType + comando.name + " = " + comando.value.toExpresion() +  ";"
    // return "a";
}

export function transCreacion(comando){
    // emitter.logs.push("Creando en Java");
    // emitter.logs.push(comando.value)
    let assignedDataType = "Object ";
    if (comando.dataType != undefined){
        assignedDataType = comando.dataType;
    }

    if (comando.value == null) return "\t\t" + assignedDataType + comando.name + ";"; 
    return "\t\t" + assignedDataType + comando.name + " = " + comando.value.toExpresion(emitter) +  ";"
}

export function transCondicional(comando, transpilador){
    let condicionFinal;
    if (comando.condicion.token.type == TokenType.VERDAD ) {
        condicionFinal = true;
    } else if (comando.condicion.token.type == TokenType.FALSO) {
        condicionFinal = false;
    } else {
        condicionFinal = comando.condicion.token.lexeme;
    }

    let contenidoFinal;
    if(comando.comandos == undefined){
        contenidoFinal = "";
    } else {
        contenidoFinal = comando.comandos.transpilar(transpilador);
    }
    return "\t\tif(" + condicionFinal + "){\n\t\t" + contenidoFinal + "\n\t\t}"
}

export function transCiclo(comando){

}

export function transMetodo(comando){

}

export function transOperacion(comando){

}

export function transAcceso(comando){

}
