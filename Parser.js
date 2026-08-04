import * as TokenType from "./TokenTypes.js";
import * as Exp from "./Expresion.js";
import * as Comando  from "./Comandos.js";
import Variable from "./Variable.js";
import process from "node:process";

export class Parser {
    constructor(tokens){
        this.tokenIndex = 0;
        this.tokenList = tokens;
        this.stopParsing = false;
        this.hadError = false;
        this.declaredVariables = [];
        this.logs = [];

        this.result;

    }

    parseProgram(tokens, holder){
        this.tokenList = tokens;

        let commands = [];
        while (!this.match(this.currentToken(), [TokenType.EOF])){
            
            let currentCommand = this.command();

            if (currentCommand != undefined) {
                commands.push(currentCommand);
            }
        }
        
        
        this.logs.push(" \n\n+=> COMANDOS:");
        let i = 0;
        for (let com of commands){
            this.logs.push("   C"  + i + ". " + com.toString() + "\n");
            i++;
        }
        
        this.printLogs();
        this.result = commands;

    }
    
    command(){
        
        let comando;

        switch (this.currentToken().type){

            case TokenType.VAR:
                // console.log("   Creacion");
                comando = this.creacion();
            break;

            case  TokenType.IMPRIME:
                // console.log("   Impresion");
                comando = this.impresion();
            break;

            case  TokenType.IDENTIFIER:
                // console.log("   Asignacion");
                comando = this.asignacion();
            break;

            case  TokenType.SI:
                console.log("   Condicional");
                comando = this.condicional();
            break;

            default:
                console.log("Abort");
                this.abort("Invalid Command", 1);
            break;

        }

        this.advanceIndex(1);

        return comando;

    }

    condicional(){
        this.logs.push(this.currentToken());
        
        this.advanceIndex(1);
        this.logs.push(this.currentToken());
        if (this.currentToken() != TokenType.PARENTSISABIERTO){
            this.abort("Expecting \" ( \" ");
        }
        
        this.advanceIndex(1);
        this.logs.push(this.currentToken());

        if (
            this.currentToken().value != false &&
            this.currentToken().value != true 
        ){
            
            this.abort("Expectig Boolean Literal")
        }

        let condicion = this.currentToken();

        this.advanceIndex(1);
        this.logs.push(this.currentToken());
        if (this.currentToken() != TokenType.PARENTESISCERRADO){
            this.abort("Expecting \" ) \" ");
        }

        this.advanceIndex(1);
        this.logs.push(this.currentToken());
        if (this.currentToken() != TokenType.LLAVEABIERTA){
            this.abort("Expecting \" { \" ");
        }

        this.advanceIndex(1);
        this.logs.push(this.currentToken());
        let command = this.command();
        console.log("Condicional procesado sin errores")

        return new Comando.Condicional(condicion, command);

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
            let isDeclared = false;
            for (let variable of this.declaredVariables){
                if (variable.nombre == this.currentToken().value){
                    isDeclared = true;
                }
                // console.log(variable.nombre);
                // console.log(this.currentToken().value);
                // console.log();
            }
            if (!isDeclared){
                console.log(isDeclared);
                this.abort(`Se intento una operacion con una variable no declarada\nValor Token: ${this.currentToken()}`, 1)
            }

        } else if (this.currentToken().type != TokenType.LITERAL){
            this.abort("Expecting Literal  ", 1);
        }

        this.logs.push(this.currentToken());

        variableValue = this.expresion();

        this.advanceIndex(1);
        if (this.currentToken().type != TokenType.EOC){
            this.abort("Expecting \" ; \"", 1);
        }

        

        return new Comando.Asignacion(variableName, variableValue);
    }
    
    creacion(){
        let asignValue = false;
        let variableName;
        let variableValue = null;
        let variableType = "int";

        this.advanceIndex(1);
        if (this.currentToken().type != TokenType.IDENTIFIER){
            this.abort("Expecting Identifier ", 1);
        }

        variableName = this.currentToken().value;

        for (let variable of this.declaredVariables){
            if (variable.nombre == variableName){
                this.abort("Variable \"" + variable.nombre +"\" Already Declared ", 1);
            };
        }
        this.logs.push("Variable  \"" + variableName +"\" added to Declared variables list");
        
        if(variableType == undefined && variableValue != null){
            switch(typeof variableValue){
                case "string":
                    variableType = "String";
                break;

                case "number":
                case "bigint":
                    variableType = "integer";
                break;

                case "boolean":
                    variableType = "bool"
                    break;

                case "symbol":
                case "undefined":
                case "object":
                case "function":
                default:
                    this.abort(`Invalid DataType \"${typeof variableValue}\" ${variableValue}`, 1);
                    break;
            }
        }

        this.advanceIndex(1);

        if (this.currentToken().type == "="){
            this.advanceIndex(1);
            variableValue = this.expresion();
            this.advanceIndex(1);
        } 
    

        if (this.currentToken().type != TokenType.EOC){
            this.abort("Expecting \" ; \"", 1);
        }

        console.log(
            `
            Name: ${variableName} \n
            Value: ${variableValue}\n
            `
        );
        this.declaredVariables.push(new Variable(variableName, variableValue, variableType));
        return new Comando.Creacion(variableName, variableValue);
    }

    impresion(){
        
        let valorAImprimir;
        this.advanceIndex(1);
        if (this.currentToken().type != TokenType.LLAVEABIERTA){
            this.abort("Expecting \" { \"", 1);
        }

        this.advanceIndex(1);
        // console.log(this.currentToken())
        valorAImprimir = this.expresion();
        this.logs.push(valorAImprimir);
        this.logs.push("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

        if (valorAImprimir == undefined) this.abort("Expecting Expression", 1);

        this.advanceIndex(1);
         if (this.currentToken().type != TokenType.LLAVECERRADA){
            this.abort("Expecting \" } \"", 1);
        }

        this.advanceIndex(1);
        if (this.currentToken().type != TokenType.EOC){
            this.abort("Expecting \" ; \"", 1);
        }

        
        return new Comando.Impresion(valorAImprimir);
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

        let expresion = new Exp.LITERAL(this.currentToken());

        while(this.match(this.nextToken(), [TokenType.MULTIPLY, TokenType.DIVIDE])){

            let operator = new Exp.OPERATOR(this.nextToken());
            this.advanceIndex(2);
            let secondOperand = this.divMult();
            
            expresion = new Exp.BINARY(expresion, operator, secondOperand)
        }

        return expresion;

    }

    LITERAL(){


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
        console.error("ParsingError. " + mes + ` at line ${this.currentToken().line} on token [ ${this.currentToken()} ] `); 
        this.printLogs();
        process.exit(errCode);
    }

    printLogs(){
        console.log("Parser Logs--------");
        for (let log of this.logs){
            console.log(log);
        }
        console.log("------------------\n\n");
    }

}

  

    
