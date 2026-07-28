import * as TokenTypes from "./TokenTypes.js";
import {Lexer} from "./Lexer.js";
import {Parser} from "./Parser.js";
import {Emitter} from "./Emitter.js";
import fs from 'node:fs';
import process from "node:process";
import ps from 'prompt-sync';

const prompt = ps();

// let username = prompt("Enter your Name ");
// console.log(`Username is: ${username}`)

let outPut;

let source = fs.readFileSync('./main.nx', 'utf8');
let sourceItems = [];

for (let char of source){
    sourceItems.push(char);
}

let lexer = new Lexer();
let parser = new Parser();
let emitter = new Emitter();


lexer.process(source);
parser.parseProgram(lexer.tokens);
emitter.giveCommands(parser.result);
emitter.giveVariableInfo(parser.declaredVariables);
emitter.createJavaFile('./MAIN.java');
