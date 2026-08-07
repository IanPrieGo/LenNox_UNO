
import * as TokenType from "./TokenTypes.js";

export class BINARY{
    constructor(firstOperand, operator, secondOperand){
        this.firstOperand = firstOperand;
        this.operator = operator;
        this.secondOperand = secondOperand;
    }

    toString(){
        return "BINARY (" + this.firstOperand + " " + this.operator + " " + this.secondOperand + ")";
    }

    toExpresion(e){
        return `(${this.getDataType(e, this.firstOperand)})` + this.firstOperand.token.value + " " + this.operator.token + ` (${this.getDataType(e, this.firstOperand)})` + this.secondOperand.token.value;
    }

    getDataType(emitter, variable){
        let type;
        for (let dv of emitter.declaredVariables){
            if (dv.nombre == variable.token.lexeme){
                return dv.tipo;
            }
        }
        return undefined;
    }
    
    concatenate(){
        return this.firstOperand.concatenate() + " " + this.operator.concatenate() + " " + this.secondOperand.concatenate();
    }
}

export class LITERAL{
    constructor(token){
        this.token = token;
    }

    toString(){
        return this.token.toString();
    }

    toExpresion(){
        return this.token.lexeme;
    }

    concatenate(){
        if (this.token.type == TokenType.CADENA){
            return "\"" + this.token.lexeme + "\"";
        }
        return this.token.lexeme;
    }

    toValue(){
        let valor;
        
        return valor;
    }
}

export class OPERATOR{
    constructor(token){
        this.token = token;
    }

    toString(){
        return this.token.toString();
    }

    // toExpresion(){
    //     return this.token.lexeme;
    // }

    concatenate(){
        return this.token.lexeme;
    }
}