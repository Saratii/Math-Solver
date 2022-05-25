import { Binary, IfStmt, UnaryOperator } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BinaryOperationNode, DivisionNode, MinusNode, MultiplyNode, MyNode, NegativeNode, NumberNode, PlusNode, UnaryOperationNode } from './Nodes';
import { DivisionToken, MinusToken, MultiplyToken, NegativeToken, NumberToken, PlusToken, Token } from './Tokens';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
    constructor() { }
    tokenize(s:string): Token[] {
        let tokenlist = [];
        while(s){
            if(/^\-/.test(s)){
                if(tokenlist.length>0 && tokenlist[tokenlist.length-1] instanceof NumberToken){
                    tokenlist.push(new MinusToken());
                } else {
                    tokenlist.push(new NegativeToken());
                }
                s = s.substring(1);
            } else if(/^\-?[0-9]+(\.[0-9]+)?/.test(s)){
                let nextNum = (s.match(/^\-?[0-9]+(\.[0-9]+)?/)||[])[0];
                tokenlist.push(new NumberToken(parseFloat(nextNum)));
                s = s.substring(nextNum.length);
            } else if(/^\+/.test(s)){
                tokenlist.push(new PlusToken());
                s = s.substring(1);
            } else if(/^\*/.test(s)){
                tokenlist.push(new MultiplyToken());
                s = s.substring(1);
            } else if(/^\//.test(s)){
                tokenlist.push(new DivisionToken());
                s = s.substring(1);
            } else {
                s = s.substring(1)
            }
            s = s.trim();
        } 
        return tokenlist;
    }

    lex(tokens:Token[]): MyNode{
        let unusedNodes: MyNode[] = []; //makes unused node list
        for(let token of tokens){ //loops through tokens
            if(token as any instanceof NumberToken){ //if token is a number
                this.combineNodes(unusedNodes, new NumberNode((token as NumberToken).val));
                // if(unusedNodes.length === 0){ //if the unused node list is empty
                //     unusedNodes.push(new NumberNode((token as NumberToken).val)); //adds number node to unused nodes
                // } else if(unusedNodes.length > 1){  //if there is already a node in there
                //     let previousNode = unusedNodes.pop();
                //     if(previousNode instanceof BinaryOperationNode){
                //         let operationNode: BinaryOperationNode = previousNode as BinaryOperationNode; //take the last node added (operation node)
                //         let leftNode = unusedNodes.pop() as MyNode; //make the number in there as the left child of the operator
                //         let rightNode = new NumberNode((token as NumberToken).val);
                //         if(leftNode.priority < operationNode.priority){
                //             let leftRightNode = (leftNode as BinaryOperationNode).right;
                //             operationNode.left = leftRightNode;
                //             operationNode.right = rightNode;
                //             (leftNode as BinaryOperationNode).right = this.orderSwap(operationNode);
                //             unusedNodes.push(leftNode);
                //         } else {
                //             operationNode.left = leftNode;
                //             operationNode.right = rightNode;
                //             unusedNodes.push(operationNode);
                //         }
                //     } else if(previousNode instanceof UnaryOperationNode){
                //         previousNode.child = new NumberNode((token as NumberToken).val);
                //         unusedNodes.push(previousNode);
                //     } 
                // }
            } else if(token as any instanceof MinusToken){
                unusedNodes.push(new MinusNode(undefined, undefined));
            } else if(token as any instanceof PlusToken){
                unusedNodes.push(new PlusNode(undefined, undefined));
            } else if(token as any instanceof MultiplyToken){
                unusedNodes.push(new MultiplyNode(undefined, undefined));
            } else if(token as any instanceof DivisionToken){
                unusedNodes.push(new DivisionNode(undefined, undefined));
            } else if(token as any instanceof NegativeToken){
                unusedNodes.push(new NegativeNode(undefined));
            }
        }
        return unusedNodes.pop() || new NumberNode(69);
    }

    orderSwap(node:BinaryOperationNode){
        if(node.priority>(node?.right?.priority || 69)){
            let operationNode = node.right as BinaryOperationNode;
            let leftNode = node.left;
            let operationNodeLeft = operationNode.left;
            let operationNodeRight = operationNode.right;
            operationNode.left = leftNode;
            operationNode.right = node;
            node.left = operationNodeLeft;
            node.right = operationNodeRight;
            operationNode.right = this.orderSwap(operationNode.right as BinaryOperationNode);
            return operationNode;
        } else {
            return node;
        }
    }
    combineNodes(unusedNodes:MyNode[], latestNode:MyNode){
        if(unusedNodes.length === 0){
            unusedNodes.push(latestNode);
            return;
        }
        let topNode = unusedNodes.pop();
        if(topNode instanceof UnaryOperationNode){
            topNode.child = latestNode;
            this.combineNodes(unusedNodes, topNode);
        } else if(topNode instanceof BinaryOperationNode){
            if(unusedNodes.length === 0){
                unusedNodes.push(topNode);
                return;
            }
            let leftNode:MyNode = unusedNodes.pop() as MyNode;
            if(leftNode.priority < topNode.priority){
                let leftRightNode = (leftNode as BinaryOperationNode).right;
                topNode.left = leftRightNode;
                topNode.right = latestNode;
                (leftNode as BinaryOperationNode).right = this.orderSwap(topNode);
                unusedNodes.push(leftNode);
            } else {
                topNode.left = leftNode;
                topNode.right = latestNode;
                unusedNodes.push(topNode);
            }
        }
    }
}