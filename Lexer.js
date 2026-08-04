import * as TokenTypes from "./TokenTypes.js";
import {Token} from "./Token.js";
import process from "node:process";
import { clearScreenDown } from "node:readline";
import { match } from "node:assert";

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
                    // console.log("Checando comentarios");
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
                case "-":
                case "*":
                case "/":
                    this.tokens.push(new Token(TokenTypes.OPERADOR, this.currentChar(), this.lineIndex));
                break;

                case ">":
                case "<":
                case "!":
                case "=":
                    if (this.nextChar() == "="){
                        this.tokens.push(new Token(TokenTypes.OPERADOR, this.currentChar() + this.nextChar(), this.lineIndex));
                    } else {
                        this.tokens.push(new Token(TokenTypes.OPERADOR, this.currentChar(), this.lineIndex));
                    }
                break;

                case ";":
                    this.tokens.push(new Token(TokenTypes.EOC, this.currentChar(), this.lineIndex));
                break;

                case "{":
                case "(":
                    this.tokens.push(new Token(TokenTypes.ABRIR_GRUPO, this.currentChar(), this.lineIndex));
                break;

                case "}":
                case ")":
                    this.tokens.push(new Token(TokenTypes.CERRRA_GRUPO, this.currentChar(), this.lineIndex));
                break;

                case "\"":                    
                    let cadena =  "";
                    let quit = false;
                    let keyPos;
                    this.charIndex++;
                    while(this.currentChar() != "\""){
                        cadena += this.currentChar();
                        this.charIndex++;
                    }
                    this.tokens.push(new Token(TokenTypes.LITERAL, cadena, this.lineIndex));

                break;

                
                default:
                if (this.isNumeric(this.currentChar())) {
                    let num =  this.currentChar();
                    while(this.isNumeric(this.nextChar())){
                        this.charIndex++;
                        num += this.currentChar();
                    }
                    this.tokens.push(new Token(TokenTypes.LITERAL, num, this.lineIndex));

                } else if(this.isAlpha(this.currentChar())){
                    let word =  this.currentChar();
                    while(this.isAlpha(this.nextChar())){
                        this.charIndex++;
                        word += this.currentChar();
                    }

                    switch(word){
                        case "Imprime":
                        case "Mientras":
                        case "Var":
                        case "Si":
                        case "Sino":
                        case "ver":
                        case "fal":
                        case "nul":
                            this.tokens.push(new Token(TokenTypes.PALABRA_RESERVADA, word, this.lineIndex));
                        break;

                        default:
                            this.tokens.push(new Token(TokenTypes.IDENTIFICADOR, word, this.lineIndex));
                        break;
                    }
                    

                } else if (this.currentChar() === undefined){
                    //Just Exit The Loop
                } else {
                    let char = [this.currentChar()]
                    console.log(char);
                    console.log(this.charIndex);
                    process.exit(1);
                }
                break;
            }
            
            this.charIndex++;
        }

        this.tokens.push(new Token(TokenTypes.EOF, null, this.lineIndex));

        // console.log(this.tokens);

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