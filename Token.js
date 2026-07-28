import * as TokenTypes from "./TokenTypes.js";

export class Token {
    constructor(type, value, line){
        this.type = type;
        this.value = value;
        this.line = line;
    }

    toString(){
        return this.type;
    }
}

export class Statement extends Token{
    constructor(type, line){
        super(type, null, line);
    }
}

export class Identifier extends Token{
    constructor(type, value, name,  line){
        super(type, value, line);
        this.name = name;
    }
}

export class Operator extends Token{
    constructor(type, line){
        super(type, null, line);
    }
}

export class Literal extends Token{
    constructor(type, value, line){
        switch(value){
            case TokenTypes.ZERO: value = 0; break;
            case TokenTypes.ONE: value = 1; break;
            case TokenTypes.TWO: value = 2; break;
            case TokenTypes.THREE: value = 3; break;
            case TokenTypes.FOUR: value = 4; break;
            case TokenTypes.FIVE: value = 5; break;
            case TokenTypes.SIX: value = 6; break;
            case TokenTypes.SEVEN: value = 7; break;
            case TokenTypes.EIGHT: value = 8; break;
            case TokenTypes.NINE: value = 9; break;
        }
        super(type, value, line);
    }

    toString(){
        return "Literal(" + this.value + ", " + this.type + ")";
    }
}