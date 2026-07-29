import fs from "node:fs";


export class Emitter{
    constructor(){
        this.commands = [];
        this.declaredVariables = [];

    }

    createJavaFile(path){
        let header = 
        "public class MAIN {" + "\n" + 
        "   public static void main(String [] args) {" + "\n"
        ;

        let body = "";

        for (let com of this.commands){        
            body += com.toJava(this) + "\n";
        }

        let footer = 
        "\n   }" + "\n" + 
        "}"
        ;

        fs.writeFileSync(path, header + body + footer);
    }

    giveCommands(commands){
        console.log("Commands Recived!");
        this.commands = commands;
        console.log(this.commands);
    }

    giveVariableInfo(dv){
        console.log("Variables Recived!");
        this.declaredVariables = dv;
        console.log(this.declaredVariables);
    }

    sysOut(content, isString){
        let dQ = "";
        if (isString){
            dQ = "\""
        }
        return " System.out.println(" + dQ + content + dQ + ") "
    }

}