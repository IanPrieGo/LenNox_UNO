import * as TokenTypes from "./TokenTypes.js";
import {Token} from "./Token.js";
import process from "node:process";

export class Lexer {
    constructor(){
        this.source;
        this.charIndex = 0;
        this.lineIndex = 1;
        this.tokens = [];
        this.logs = [];
    }

    process(source){
        this.source = source;
        this.logs.push("Source: ");
        this.logs.push(source);
        
        while (this.currentChar() != undefined){

            while (
                this.currentChar() === " " |
                this.currentChar() === "\r" |
                this.currentChar() === "\n" |
                this.currentChar() === "#"
            ){  
                if (this.currentChar() === "\r")this.lineIndex++;   

                if(this.currentChar() === "#"){
                    let commStart = this.lineIndex;
                    this.charIndex++;
                    while (this.currentChar() != "#"){
                        // console.log("No encuentro el final del Comentario Jefe ");
                        if (this.currentChar() == undefined) this.abort(`No matching # for # at line ${commStart}`, 1);
                        this.charIndex++;
                    }
                }
                // console.log("Checando Caracteres fantasma");
                this.charIndex++;
            }

            

            // console.log("Checando Caracteres");
            // console.log(this.currentChar()  + ", "+ this.charIndex);
            switch(this.currentChar()){
                
                case "+":
                    this.tokens.push(new Token(TokenTypes.CRUZ, this.currentChar(), null, this.lineIndex));
                    break;
                case "-":
                    this.tokens.push(new Token(TokenTypes.RAYA, this.currentChar(), null, this.lineIndex));
                    break;
                case "*":
                    this.tokens.push(new Token(TokenTypes.ASTERISCO, this.currentChar(), null, this.lineIndex));
                    break;
                case "/":
                    this.tokens.push(new Token(TokenTypes.DIAGONAL, this.currentChar(), null, this.lineIndex));
                    break;
            

                case ">":
                    if (this.nextChar() == "="){
                        this.tokens.push(new Token(TokenTypes.MAYOR_IGUAL, this.currentChar() + this.nextChar(), null, this.lineIndex));
                        this.charIndex++;
                    } else {
                        this.tokens.push(new Token(TokenTypes.MAYOR_QUE, this.currentChar(), null, this.lineIndex));
                    }
                    break;
                case "<":
                    if (this.nextChar() == "="){
                        this.tokens.push(new Token(TokenTypes.MENOR_IGUAL, this.currentChar() + this.nextChar(), null, this.lineIndex));
                        this.charIndex++;
                    } else {
                        this.tokens.push(new Token(TokenTypes.MENOR_QUE, this.currentChar(), null, this.lineIndex));
                    }                    
                    break;
                case "!":   
                    if (this.nextChar() == "="){
                        this.tokens.push(new Token(TokenTypes.NO_IGUAL, this.currentChar() + this.nextChar(), null, this.lineIndex));
                        this.charIndex++;
                    } else {
                        this.tokens.push(new Token(TokenTypes.NO_ES, this.currentChar(), null, this.lineIndex));
                    }
                    break;
                case "=":
                    if (this.nextChar() == "="){
                        this.tokens.push(new Token(TokenTypes.IGUAL_IGUAL, this.currentChar() + this.nextChar(), null, this.lineIndex));
                        this.charIndex++;
                    } else {
                        this.tokens.push(new Token(TokenTypes.IGUAL, this.currentChar(), null,  this.lineIndex));
                    }
                    break;

                case ";":
                    this.tokens.push(new Token(TokenTypes.PUNTO_COMA, this.currentChar(), null,  this.lineIndex));
                    break;
                case "{":
                    this.tokens.push(new Token(TokenTypes.LLAVE_ABIERTA, this.currentChar(), null, this.lineIndex));
                    break;
                case "(":
                    this.tokens.push(new Token(TokenTypes.PARENTESIS_ABIERTO, this.currentChar(), null, this.lineIndex));
                    break;
                case "}":
                    this.tokens.push(new Token(TokenTypes.LLAVE_CERRADA, this.currentChar(), null, this.lineIndex));
                    break;
                case ")":
                    this.tokens.push(new Token(TokenTypes.PARENTESIS_CERRADO, this.currentChar(), null, this.lineIndex));
                    break;

                case "\"":
                    let cadena = "";
                    let quit = false;
                    let keyPos;
                    this.charIndex++;
                    while(this.currentChar() != "\""){
                        if (this.currentChar() == undefined) this.abort(`No matching " for " at line ${this.lineIndex}`, 1);
                        cadena += this.currentChar();
                        this.charIndex++;
                    }
                    this.tokens.push(new Token(TokenTypes.CADENA, cadena, null, this.lineIndex));
                    break;

                
                default:
                if (this.isNumeric(this.currentChar())) {
                    let num =  this.currentChar();
                    while(this.isNumeric(this.nextChar())){
                        this.charIndex++;
                        num += this.currentChar();
                    }
                    this.tokens.push(new Token(TokenTypes.NUMERO, num, num, this.lineIndex));

                } else if(this.isAlpha(this.currentChar())){
                    let word =  this.currentChar();
                    while(this.isAlpha(this.nextChar())){
                        this.charIndex++;
                        word += this.currentChar();
                    }

                    switch(word){
                        case "Imprime":
                            this.tokens.push(new Token(TokenTypes.IMPRIME, word, null, this.lineIndex));
                        break;
                        case "Mientras":
                            this.tokens.push(new Token(TokenTypes.MIENTRAS, word, null, this.lineIndex));
                        break;
                        case "Var":
                            this.tokens.push(new Token(TokenTypes.VAR, word, null, this.lineIndex));
                        break;
                        case "Si":
                            this.tokens.push(new Token(TokenTypes.SI, word, null, this.lineIndex));
                        break;
                        case "Sino":
                            this.tokens.push(new Token(TokenTypes.SINO, word, null, this.lineIndex));
                        break;

                        case "ver":
                            this.tokens.push(new Token(TokenTypes.VERDAD, word, true, this.lineIndex));
                        break;
                        case "fal":
                            this.tokens.push(new Token(TokenTypes.FALSO, word, false, this.lineIndex));
                        break;
                        case "nul":
                            this.tokens.push(new Token(TokenTypes.NULO, word, null, this.lineIndex));
                        break;

                        default:
                            this.tokens.push(new Token(TokenTypes.IDENTIFICADOR, word, null, this.lineIndex));
                        break;
                    }
                    

                } else if (this.currentChar() === undefined){
                    //Just Exit The Loop
                } else {
                    // let char = [this.currentChar()]
                    // console.log(char);
                    // console.log(this.charIndex);
                    // process.exit(1);
                    this.abort("Carácter Inesperado [ " + this.currentChar() + " ] en la línea " + this.lineIndex, 1);
                }
                break;
            }
            
            this.charIndex++;
        }

        this.tokens.push(new Token(TokenTypes.FDA,null, null, this.lineIndex));

        this.logs.push("Processed Tokens: ");
        this.logs.push(this.tokens);

    }

    nextChar(){
        return this.source[this.charIndex + 1];
    }

    currentChar(){
        return this.source[this.charIndex];
    }

    isAlpha(char){
        return char <= "z" && char >= "a" | char <= "Z" && char >= "A";
    }

    isNumeric(char){
        return char <= "9" && char >= "0";
    }

    abort(mes, errCode){
        console.error("LexingError. " + mes); process.exit(errCode);
    }

    printLogs(){
        console.log("Lexer Logs--------");
        for (let log of this.logs){
            console.log(log);
        }
        console.log("------------------\n\n");
    }

}