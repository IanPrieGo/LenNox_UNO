import fs from "node:fs";


export class Emitter{
    constructor(){
        this.commands = [];
        this.declaredVariabled = [];

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
        this.commands = commands;
    }

    giveVariableInfo(dv){
        this.declaredVariabled = dv;
    }

    sysOut(content, isString){
        let dQ = "";
        if (isString){
            dQ = "\""
        }
        return " System.out.println(" + dQ + content + dQ + ") "
    }

}