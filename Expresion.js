

export class BINARY{
    constructor(firstOperand, operator, secondOperand){
        this.firstOperand = firstOperand;
        this.operator = operator;
        this.secondOperand = secondOperand;
    }

    toString(){
        return "BINARY (" + this.firstOperand + " " + this.operator + " " + this.secondOperand + ")";
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

    concatenate(){
        return this.token.type;
    }
}