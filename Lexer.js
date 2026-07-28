import * as TokenTypes from "./TokenTypes.js";
import {Token, Statement, Operator, Literal, Identifier} from "./Token.js";
import process from "node:process";
import { clearScreenDown } from "node:readline";

export class Lexer {
    constructor(){
        this.source;
        this.charIndex = 0;
        this.lineIndex = 1;
        this.tokens = [];
    }

    process(source){
        this.source = source;
        
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
                    let commStart = this.charIndex;
                    this.charIndex++;
                    while (this.currentChar() != "#"){
                        // console.log("No encuentro el final del Comentario Jefe ");
                        if (this.currentChar() == undefined) this.abort(`No matching # for # at ${commStart}`, 1);
                        this.charIndex++;
                    }
                }
                // console.log("Checando Caracteres fantasma");
                this.charIndex++;
            }

            

            // console.log("Checando Caracteres");
            // console.log(this.currentChar()  + ", "+ this.charIndex);
            switch(this.currentChar()){
                
                case TokenTypes.PLUS:
                    this.tokens.push(new Operator(TokenTypes.PLUS, this.lineIndex));
                break;
                
                case TokenTypes.MINUS:
                    this.tokens.push(new Operator(TokenTypes.MINUS, this.lineIndex));
                break;
                
                case TokenTypes.MULTIPLY:
                    this.tokens.push(new Operator(TokenTypes.MULTIPLY, this.lineIndex));
                break;
                
                case TokenTypes.DIVIDE:
                    this.tokens.push(new Operator(TokenTypes.DIVIDE, this.lineIndex));
                break;

                case "=":
                    this.tokens.push(new Token(TokenTypes.EQUAL, null, this.lineIndex));
                break;

                case ";":
                    this.tokens.push(new Statement(TokenTypes.EOC, this.lineIndex));
                break;

                case "{":
                    this.tokens.push(new Token(TokenTypes.LLAVEABIERTA, null, this.lineIndex));
                break;

                case "}":
                    this.tokens.push(new Token(TokenTypes.LLAVECERRADA, null, this.lineIndex));
                break;

                case "\"":
                    // console.log("Double Quotes!");
                    
                    let cadena =  "";
                    let quit = false;
                    let keyPos;
                    this.charIndex++;
                    while(this.currentChar() != "\""){
                        cadena += this.currentChar();
                        this.charIndex++;
                    }
                    this.tokens.push(new Literal(TokenTypes.CADENA, cadena, this.lineIndex));

                break;

                
                default:
                if (this.isNumeric(this.currentChar())) {
                    let num =  this.currentChar();
                    while(this.isNumeric(this.nextChar())){
                        this.charIndex++;
                        num += this.currentChar();
                    }
                    this.tokens.push(new Literal(TokenTypes.LITERAL, num, this.lineIndex));

                } else if(this.isAlpha(this.currentChar())){
                    let word =  this.currentChar();
                    while(this.isAlpha(this.nextChar())){
                        this.charIndex++;
                        word += this.currentChar();
                    }

                    switch(word){
                        case TokenTypes.IMPRIME:
                            this.tokens.push(new Statement(TokenTypes.IMPRIME, this.lineIndex));
                        break;

                        case TokenTypes.MIENTRAS:
                            this.tokens.push(new Statement(TokenTypes.MIENTRAS, this.lineIndex));
                        break;

                        case TokenTypes.LET:
                            this.tokens.push(new Statement(TokenTypes.LET, this.lineIndex));
                        break;

                        case TokenTypes.SI:
                            this.tokens.push(new Statement(TokenTypes.SI, this.lineIndex));
                        break;

                        case TokenTypes.SINO:
                            this.tokens.push(new Statement(TokenTypes.SINO, this.lineIndex));
                        break;
                        
                        default:
                            this.tokens.push(new Identifier(TokenTypes.IDENTIFIER, word, this.lineIndex));
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

}