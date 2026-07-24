import * as TokenTypes from "./TokenTypes.js";
import {Token, Statement, Operator, Literal, Identifier} from "./Token.js";
import process from "node:process";
import { clearScreenDown } from "node:readline";

export class Lexer {
    constructor(){
        this.source;
        this.charIndex = 0;
        this.tokens = [];
    }

    process(source){
        this.source = source;

        while (this.currentChar() != undefined){
            
            while (
            this.currentChar() === " " |
            this.currentChar() === "\r" |
            this.currentChar() === "\n" 
            ){
                this.charIndex++;
            }


            // console.log(this.currentChar()  + ", "+ this.charIndex);
            switch(this.currentChar()){
                
                case TokenTypes.PLUS:
                    this.tokens.push(new Operator(TokenTypes.PLUS));
                break;
                
                case TokenTypes.MINUS:
                    this.tokens.push(new Operator(TokenTypes.MINUS));
                break;
                
                case TokenTypes.MULTIPLY:
                    this.tokens.push(new Operator(TokenTypes.MULTIPLY));
                break;
                
                case TokenTypes.DIVIDE:
                    this.tokens.push(new Operator(TokenTypes.DIVIDE));
                break;

                case "=":
                    this.tokens.push(new Token(TokenTypes.EQUAL, null));
                break;

                case ";":
                    this.tokens.push(new Statement(TokenTypes.EOC));
                break;

                case "{":
                    this.tokens.push(new Token(TokenTypes.LLAVEABIERTA, null));
                break;

                case "}":
                    this.tokens.push(new Token(TokenTypes.LLAVECERRADA, null));
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
                    this.tokens.push(new Literal(TokenTypes.CADENA, cadena));

                break;

                
                default:
                if (this.isNumeric(this.currentChar())) {
                    let num =  this.currentChar();
                    while(this.isNumeric(this.nextChar())){
                        this.charIndex++;
                        num += this.currentChar();
                    }
                    this.tokens.push(new Literal(TokenTypes.LITERAL, num));

                } else if(this.isAlpha(this.currentChar())){
                    let word =  this.currentChar();
                    while(this.isAlpha(this.nextChar())){
                        this.charIndex++;
                        word += this.currentChar();
                    }

                    switch(word){
                        case TokenTypes.IMPRIME:
                            this.tokens.push(new Statement(TokenTypes.IMPRIME));
                        break;

                        case TokenTypes.MIENTRAS:
                            this.tokens.push(new Statement(TokenTypes.MIENTRAS));
                        break;

                        case TokenTypes.LET:
                            this.tokens.push(new Statement(TokenTypes.LET));
                        break;

                        case TokenTypes.SI:
                            this.tokens.push(new Statement(TokenTypes.SI));
                        break;

                        case TokenTypes.SINO:
                            this.tokens.push(new Statement(TokenTypes.SINO));
                        break;
                        
                        default:
                            this.tokens.push(new Identifier(TokenTypes.IDENTIFIER, word));
                        break;
                    }
                    

                } else if (this.currentChar() === undefined){
                    //Just Exit The Loop
                } else {
                    console.log("Invalid Token: " + this.currentChar());
                    process.exit(1);
                }
                break;
            }
            
            this.charIndex++;
        }

        this.tokens.push(new Token(TokenTypes.EOF, null));

        console.log(this.tokens);

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

    checkForKeyWords(){

    }

}