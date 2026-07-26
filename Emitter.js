import fs from "node:fs";


export class Emitter{
    constructor(){
        this.commands = [];

    }

    createJavaFile(path){
        let header = 
        "public class MAIN {" + "\n" + 
        "   public static void main(String [] args) {" + "\n"
        ;

        let body = "";

        for (let com of this.commands){
            body+= com.toJava();
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

    sysOut(content, isString){
        let dQ = "";
        if (isString){
            dQ = "\""
        }
        return " System.out.println(" + dQ + content + dQ + ") "
    }

}