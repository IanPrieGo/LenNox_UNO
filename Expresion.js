

export class BINARY{
    constructor(firstOperand, operator, secondOperand){
        this.firstOperand = firstOperand;
        this.operator = operator;
        this.secondOperand = secondOperand;
    }

    toString(){
        return "BINARY (" + this.firstOperand + " " + this.operator + " " + this.secondOperand + ")";
    }

    toExpresion(emitter){
        return `(${this.firstOperand.token.value})` + this.firstOperand.token.value + " " + this.operator.token + ` (${this.secondOperand.token.value})` + this.secondOperand.token.value;
    }

    checkVariableType(){
        
    }
    
    concatenate(){
        return this.firstOperand.concatenate() + " " + this.operator.concatenate() + " " + this.secondOperand.concatenate();
    }
}

export class PRIMARY{
    constructor(token){
        this.token = token;
    }

    toString(){
        return "PRIMARY("+ this.token.toString() + ")";
    }

    toExpresion(emitter){
        return this.token.value;
    }

    concatenate(){
        return "\"" + this.token.value  + "\"";
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
        return this.token.type;
    }
}