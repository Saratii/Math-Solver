import { Injectable } from '@angular/core';
import { BinaryOperationNode, MinusNode, MyNode, NumberNode, PlusNode } from './Nodes';
import { MinusToken, NumberToken, PlusToken, Token } from './Tokens';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
    constructor() { }
    tokenize(s:string): Token[] {
        let tokenlist = [];
        while(s){
            if(/^\-/.test(s)){
                tokenlist.push(new MinusToken());
                s = s.substring(1);
            } else if(/^\-?[0-9]+(\.[0-9]+)?/.test(s)){
                let nextNum = (s.match(/^\-?[0-9]+(\.[0-9]+)?/)||[])[0];
                let results = (s.match(/^\-?[0-9]+(\.[0-9]+)?/));
                console.log(results);
                tokenlist.push(new NumberToken(parseFloat(nextNum)));
                s = s.substring(nextNum.length);
            } else if(/^\+/.test(s)){
                tokenlist.push(new PlusToken());
                s = s.substring(1);
            } else {
                s = s.substring(1)
            }
            s = s.trim();
        } 
        return tokenlist;
    }

    lex(tokens:Token[]): MyNode{
        let unusedNodes: MyNode[] = [];
        for(let token of tokens){
            if(token as any instanceof NumberToken){
                if(unusedNodes.length === 0){
                    unusedNodes.push(new NumberNode((token as NumberToken).val));
                } else if(unusedNodes.length > 1){
                    let operationNode: BinaryOperationNode = unusedNodes.pop() as BinaryOperationNode;
                    let leftNode = unusedNodes.pop() as MyNode;
                    operationNode.left = leftNode;
                    operationNode.right = new NumberNode((token as NumberToken).val);
                    unusedNodes.push(operationNode);
                }
            } else if(token as any instanceof MinusToken){
                unusedNodes.push(new MinusNode());
            } else if(token as any instanceof PlusToken){
                unusedNodes.push(new PlusNode());
            }
        }
        return unusedNodes.pop() || new NumberNode(69);
    }
}