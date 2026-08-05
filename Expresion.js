
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
            if (dv.nombre == variable.token.value){
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
        return this.token.value;
    }

    concatenate(){
        if (this.token.type.indexOf("\"") > -1){
            return "\"" +this.token.value + "\"";
        };
        return this.token.value;
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
    //     return this.token.value;
    // }

    concatenate(){
        return this.token.value;
    }
}