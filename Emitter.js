import * as aJava from "./Transpiladores/Trans_Java.js";
import fs from "node:fs";


export class Emitter{
    constructor(){
        this.commands = [];
        this.declaredVariables = [];
        this.logs = [];

    }

    createJavaFile(path){
        let header = 
        "public class MAIN {" + "\n" + 
        "   public static void main(String [] args) {" + "\n"
        ;

        let body = "";

        for (let com of this.commands){        
            body += com.transpilar(aJava) + "\n";
        }

        let footer = 
        "\n   }" + "\n" + 
        "}"
        ;

        fs.writeFileSync(path, header + body + footer);
    }

    giveCommands(commands){
        this.logs.push("Commands Recived!");
        this.commands = commands;
        this.logs.push(this.commands);
    }

    giveVariableInfo(dv){
        this.logs.push("Variables Recived!");
        this.declaredVariables = dv;
        this.logs.push(this.declaredVariables);
    }

    sysOut(content, isString){
        let dQ = "";
        if (isString){
            dQ = "\""
        }
        return " System.out.println(" + dQ + content + dQ + ") "
    }

    printLogs(){
        console.log("Emitter Logs--------");
        for (let log of this.logs){
            console.log(log);
        }
        console.log("------------------\n\n");
    }

}