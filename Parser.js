import * as TokenType from "./TokenTypes.js";
import * as Exp from "./Expresion.js";
import * as Syntax  from "./SyntaxElements.js";
import process from "node:process";

export class Parser {
    constructor(tokens){
        this.tokenIndex = 0;
        this.tokenList = tokens;
        this.stopParsing = false;
        this.hadError = false;
        this.declaredVariables = [];

        this.result;

    }

    parseProgram(tokens, holder){
        this.tokenList = tokens;
        console.log("Programa: ");

        let commands = [];

        while (!this.match(this.currentToken(), [TokenType.EOF])){

            let currentCommand = this.command();

            if (currentCommand != undefined) {
                commands.push(currentCommand);
            }

        }

        console.log(" \n\n \t +=> COMANDOS:");
        let i = 0;
        for (let com of commands){
            console.log("   C"  + i + ". " + com.toString() + "\n");
            i++;
        }
        

        this.result = commands;

    }
    
    command(){

        let comando;

        switch (this.currentToken().type){

            case TokenType.LET:
                console.log("Creacion");
                comando = this.creacion();
            break;

            case  TokenType.IMPRIME:
                console.log("Impresion");
                comando = this.impresion();
            break;

            case  TokenType.IDENTIFIER:
                console.log("Asignacion");
                comando = this.asignacion();
            break;

            default:
                this.abort("Invalid Command", 1);
            break;

        }

        this.advanceIndex(1);

        return comando;

    }

    asignacion(){
        let variableName = this.currentToken().value;
        let variableValue;

        this.advanceIndex(1);

        if (this.currentToken() != TokenType.EQUAL){
            this.abort("Expecting \" = \" ");
        }

        this.advanceIndex(1);

        if (this.currentToken() == TokenType.IDENTIFIER){
            for (let variable of this.declaredVariables){
                if (variable[0] != this.currentToken().value){
                    this.abort("Se intento una operacion con una variable no declarada", 1)
                }
            }
        } else if (this.currentToken().type != TokenType.LITERAL){
            this.abort("Expecting Literal  ", 1);
        }

        console.log(this.currentToken());

        variableValue = this.expresion();

        this.advanceIndex(1);
        if (this.currentToken().type != TokenType.EOC){
            this.abort("Expecting \" ; \"", 1);
        }

        

        return new Syntax.Asignacion(variableName, variableValue);
    }
    
    creacion(){
        let asignValue = false;
        let variableName;
        let variableValue = null;

        this.advanceIndex(1);
        if (this.currentToken().type != TokenType.IDENTIFIER){
            this.abort("Expecting Identifier ", 1);
        }

        variableName = this.currentToken().value;

        for (let variable of this.declaredVariables){
            if (variable[0] == variableName){
                this.abort("Variable \"" + variable[0] +"\" Already Declared ", 1);
            };
        }
        console.log("Variable  \"" + variableName +"\" added to Declared variables list");

        this.advanceIndex(1);

        if (this.currentToken().type == "="){
            this.advanceIndex(1);
            variableValue = this.currentToken().value;
            this.advanceIndex(1);
        } 
    

        if (this.currentToken().type != TokenType.EOC){
            this.abort("Expecting \" ; \"", 1);
        }


        this.declaredVariables.push([variableName, variableValue]);
        return new Syntax.Creacion(variableName, variableValue);
    }

    impresion(){
        let valorAImprimir;
        this.advanceIndex(1);
        if (this.currentToken().type != TokenType.LLAVEABIERTA){
            this.abort("Expecting \" { \"", 1);
        }

        this.advanceIndex(1);
        console.log(this.currentToken())
        valorAImprimir = this.expresion();
        console.log(valorAImprimir);

        if (valorAImprimir == undefined) this.abort("Expecting Expression", 1);

        this.advanceIndex(1);
         if (this.currentToken().type != TokenType.LLAVECERRADA){
            this.abort("Expecting \" } \"", 1);
        }

        this.advanceIndex(1);
        if (this.currentToken().type != TokenType.EOC){
            this.abort("Expecting \" ; \"", 1);
        }

        return new Syntax.Impresion(valorAImprimir);
    }

    expresion(){
        return this.sumaResta();
    }

    sumaResta(){
        let expresion =  this.divMult();

        while(this.match(this.nextToken(), [TokenType.PLUS, TokenType.MINUS])){

            let operator = new Exp.OPERATOR(this.nextToken());
            this.advanceIndex(2);
            let secondOperand = this.divMult();
            
            expresion = new Exp.BINARY(expresion, operator, secondOperand)
        }

        return expresion;
    }
    
    divMult(){

        let expresion = new Exp.PRIMARY(this.currentToken());

        while(this.match(this.nextToken(), [TokenType.MULTIPLY, TokenType.DIVIDE])){

            let operator = new Exp.OPERATOR(this.nextToken());
            this.advanceIndex(2);
            let secondOperand = this.divMult();
            
            expresion = new Exp.BINARY(expresion, operator, secondOperand)
        }

        return expresion;

    }

    primary(){


    }

    match(token, typesToCheck){
        for (let type of typesToCheck){
            if(token.type == type)
            return true;
        }
        return false;
    } 

    advanceIndex(indexIncrease){
        this.tokenIndex += indexIncrease;
    }

    nextToken(){
        return this.tokenList[this.tokenIndex + 1];        
    }

    currentToken(){
        return this.tokenList[this.tokenIndex];
    }

    abort(mes, errCode){
        console.error("ParsingError. " + mes); process.exit(errCode);
    }

}

  

    
