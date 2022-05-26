import { Injectable } from '@angular/core';
import { BinaryOperationNode, DivisionNode, ErrorNode, MinusNode, MultiplyNode, MyNode, NegativeNode, NumberNode, ParenthesisNode, PlusNode, UnaryOperationNode, UnMatchedParenthesisNode } from './Nodes';
import { DivisionToken, LeftParenthesisToken, MinusToken, MultiplyToken, NegativeToken, NumberToken, PlusToken, RightParenthesisToken, Token } from './Tokens';

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
            } else if(/^\(/.test(s)){
                tokenlist.push(new LeftParenthesisToken());
                s = s.substring(1)
            } else if(/^\)/.test(s)){
                tokenlist.push(new RightParenthesisToken());
                s = s.substring(1)
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
                this.combineNodes(unusedNodes, new NumberNode((token as NumberToken).val));
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
            } else if(token as any instanceof LeftParenthesisToken){
                unusedNodes.push(new UnMatchedParenthesisNode());
            } else if(token as any instanceof RightParenthesisToken){
                if(unusedNodes.length>1){
                    let inbetweenNode: MyNode = unusedNodes.pop()!;
                    let unMatchedParenthesisNode = unusedNodes.pop();
                    if(unMatchedParenthesisNode instanceof UnMatchedParenthesisNode){
                        let parenthesisNode = new ParenthesisNode(inbetweenNode);
                        this.combineNodes(unusedNodes, parenthesisNode);
                    } else {
                        return new ErrorNode();
                    }
                } else {
                    return new ErrorNode();
                }
            }
        }
        if(unusedNodes.length != 1){
            return new ErrorNode();
        }
        return unusedNodes.pop()!;
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
                unusedNodes = [new ErrorNode()];
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
        } else if(topNode instanceof UnMatchedParenthesisNode){
            unusedNodes.push(topNode!);
            unusedNodes.push(latestNode);
        } else {
            unusedNodes = [new ErrorNode()];
        }
    }
}