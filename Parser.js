import * as TokenType from "./TokenTypes.js";
import * as Exp from "./Expresion.js";
import * as Comando  from "./Comandos.js";
import Variable from "./Variable.js";
import process from "node:process";
import chalk from "chalk";

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
        while (!this.match(this.currentToken(), [TokenType.FDA])){
            
            let currentCommand = this.command();

            if (currentCommand != undefined) {
                commands.push(currentCommand);
            } else {
                break
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

        if (this.currentToken().type == TokenType.FDA) return undefined;



        switch (this.currentToken().type){

            case TokenType.VAR:
                // console.log("   Creacion");
                comando = this.creacion();
            break;

            case  TokenType.IMPRIME:
                // console.log("   Impresion");
                comando = this.impresion();
            break;

            case  TokenType.SI:
                // console.log("   Condicional");
                comando = this.condicional();
            break;

            default:
                // console.log("   Asignacion");
                this.asignacion();
            break;

        }

        this.advanceIndex(1);

        return comando;

    }

    //COMANDOS
    condicional(){
        this.logs.push(this.currentToken());
        
        this.advanceIndex(1);
        this.logs.push(this.currentToken());
        if (this.currentToken().type != TokenType.PARENTESIS_ABIERTO){
            this.abort("Expecting \" ( \" ");
        }
        
        this.advanceIndex(1);
        this.logs.push(this.currentToken());

        if (
            this.currentToken().type != TokenType.VERDAD &&
            this.currentToken().type != TokenType.FALSO
        ){
            
            this.abort("Expectig Boolean Literal")
        }

        let condicion = this.expresion();

        this.advanceIndex(1);
        this.logs.push(this.currentToken());
        if (this.currentToken().type != TokenType.PARENTESIS_CERRADO){
            this.abort("Expecting \" ) \" ");
        }

        this.advanceIndex(1);
        this.logs.push(this.currentToken());
        if (this.currentToken().type != TokenType.LLAVE_ABIERTA){
            this.abort("Expecting \" { \" ");
        }

        this.advanceIndex(1);
        this.logs.push(this.currentToken());
        let command = this.command();

        
        this.logs.push(this.currentToken());
        if (this.currentToken().type != TokenType.LLAVE_CERRADA){
            this.abort("Expecting \" } \" ");
        }
        console.log("Condicional procesado sin errores")

        return new Comando.Condicional(condicion, command);

    }

    asignacion(){
        let variableName = this.currentToken().lexeme;
        let variableValue;

        this.advanceIndex(1);

        if (this.currentToken().type != TokenType.IGUAL){
            this.abort("Expecting \" = \" ");
        }

        this.advanceIndex(1);

        switch (this.currentToken().type){
            case TokenType.IDENTIFICADOR:
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
                break;
            case TokenType.VERDAD:
            case TokenType.FALSO:
            case TokenType.NUMERO:
            case TokenType.CADENA:
                break;
            default:
                this.abort("Expecting Literal  ", 1);

        }

        this.logs.push(this.currentToken());

        variableValue = this.expresion();

        this.advanceIndex(1);
        if (this.currentToken().type != TokenType.PUNTO_COMA){
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
        if (this.currentToken().type != TokenType.IDENTIFICADOR){
            this.abort("Expecting Identifier ", 1);
        }

        variableName = this.currentToken().lexeme;

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

        if (this.currentToken().type == TokenType.IGUAL){
            this.advanceIndex(1);
            variableValue = this.expresion();
            this.advanceIndex(1);
        } 
    

        if (this.currentToken().type != TokenType.PUNTO_COMA){
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
        this.logs.push(this.currentToken());
        if (this.currentToken().type != TokenType.LLAVE_ABIERTA){
            this.abort("Expecting \" { \" ");
        }

        this.advanceIndex(1);
        this.logs.push("\t+=>Procesando Expresion");
        this.logs.push(this.currentToken());
        valorAImprimir = this.expresion();
        this.logs.push(valorAImprimir);

        if (valorAImprimir == undefined) this.abort("Expecting Expression", 1);

        this.advanceIndex(1);
        this.logs.push(this.currentToken());
        if (this.currentToken().type != TokenType.LLAVE_CERRADA){
            this.abort("Expecting \" { \" ");
        }

        this.advanceIndex(1);
        this.logs.push(this.currentToken());
        if (this.currentToken().type != TokenType.PUNTO_COMA){
            this.abort("Expecting \" ; \"", 1);
        }

        
        return new Comando.Impresion(valorAImprimir);
    }

    //EXPRESIONES
    expresion(){
        return this.igualdad();
    }

    igualdad(){
        return this.diferenciacion();
    }

    diferenciacion(){
        return this.sumaResta();
    }

    sumaResta(){
        let expresion =  this.divMult();
        this.logs.push("+ Primer Token:" + this.currentToken());

        while(this.match(this.nextToken(), ["-", "+"])){

            let operator = new Exp.OPERATOR(this.nextToken());
            this.advanceIndex(2);
            let secondOperand = this.divMult();
            this.logs.push("+ Segundo Token:" + this.currentToken());
            
            expresion = new Exp.BINARY(expresion, operator, secondOperand)
        }

        return expresion;
    }
    
    divMult(){

        let expresion = this.negacion();

        while(this.match(this.nextToken(), ["*", "/"])){

            let operator = new Exp.OPERATOR(this.nextToken());
            this.advanceIndex(2);
            let secondOperand = this.negacion();
            
            expresion = new Exp.BINARY(expresion, operator, secondOperand)
        }

        return expresion;

    }

    negacion(){
        return this.primaria()
    }

    primaria(){
        return new Exp.LITERAL(this.currentToken());
    }

    //Metodos Ayudantes
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

    abort(mess, errCode){
        console.error(chalk.redBright(
            "ParsingError. " + mess + 
            " at line " + this.currentToken().line + 
            " on token [" +  this.currentToken() + "]")); 
        this.printLogs();
        process.exit(errCode);
    }

    printLogs(){
        console.log("Parser Logs--------");
        if (this.logs.length == 0){
            console.log("No Logs!");
        } else {
            for (let log of this.logs){
                console.log(log);
            }
        }   
        console.log("------------------\n\n");
    }

}

  

    
