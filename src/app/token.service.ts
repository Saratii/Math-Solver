import { Injectable } from '@angular/core';
import { BinaryOperationNode, ErrorNode, MultiplyNode, MyNode, NumberNode, ParenthesisNode, SinNode, CosNode, TanNode, UnaryOperationNode, UnMatchedParenthesisNode, UnclosedSinNode, UnclosedCosNode, UnclosedTanNode, UnMatchedNode, UnclosedRSinNode, RSinNode, RTanNode, RCosNode, UnclosedRTanNode, UnclosedRCosNode } from './Nodes';
import { CosToken, DivisionToken, ExponentToken, LeftParenthesisToken, MinusToken, ModulusToken, MultiplyToken, NegativeToken, NumberToken, PlusToken, RCosToken, RightParenthesisToken, RSinToken, RTanToken, SinToken, TanToken, Token } from './Tokens';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
    constructor() {}
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
                if(this.peek(tokenlist) instanceof RightParenthesisToken){
                    tokenlist.push(new MultiplyToken())
                }
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
                if(this.peek(tokenlist) as any instanceof RightParenthesisToken || this.peek(tokenlist) as any instanceof NumberToken){
                    tokenlist.push(new MultiplyToken())
                }
                tokenlist.push(new LeftParenthesisToken());
                s = s.substring(1);
            } else if(/^\)/.test(s)){
                tokenlist.push(new RightParenthesisToken());
                s = s.substring(1);
            } else if(/^\^/.test(s)){
                tokenlist.push(new ExponentToken());
                s = s.substring(1);
            } else if(/^\%/.test(s)){
                tokenlist.push(new ModulusToken());
                s = s.substring(1);
            } else if(/^rsin\(/.test(s)){
                tokenlist.push(new RSinToken())
                s = s.substring(5);
            } else if(/^rcos\(/.test(s)){
                tokenlist.push(new RCosToken())
                s = s.substring(5);
            } else if(/^rtan\(/.test(s)){
                tokenlist.push(new RTanToken())
                s = s.substring(5);
            } else if(/^sin\(/.test(s)){
                tokenlist.push(new SinToken())
                s = s.substring(4);
            } else if(/^cos\(/.test(s)){
                tokenlist.push(new CosToken())
                s = s.substring(4);
            } else if(/^tan\(/.test(s)){
                tokenlist.push(new TanToken())
                s = s.substring(4);
            } else if(/^pi/.test(s)||/^PI/.test(s)){
                tokenlist.push(new NumberToken(Math.PI))
                s = s.substring(2);
            } else if(/^e/.test(s)){
                tokenlist.push(new NumberToken(Math.E));
                s = s.substring(1);
            } else {
                s = s.substring(1);
            }
            s = s.trim();
        }
        for(let i = 1; i<tokenlist.length; i++) {
            if(tokenlist[i] instanceof NumberToken && tokenlist[i-1] instanceof NumberToken){
                tokenlist.splice(i, 0, new MultiplyToken());
            }
        }
        return tokenlist;
    }

    lex(tokens:Token[]): MyNode{
        let unusedNodes: MyNode[] = [];
        for(let token of tokens){
            if(token as any instanceof NumberToken){
                this.combineNodes(unusedNodes, new NumberNode((token as NumberToken).val));
            } else if(token as any instanceof LeftParenthesisToken){    
                if(unusedNodes.length > 0){
                    let mostRecentNode: MyNode = unusedNodes.pop() as MyNode;
                    if(mostRecentNode instanceof NumberNode){
                        unusedNodes.push(mostRecentNode);
                        unusedNodes.push(new MultiplyNode())
                    } else {
                        unusedNodes.push(mostRecentNode);
                    }
                }
                unusedNodes.push(new UnMatchedParenthesisNode());
            } else if(token as any instanceof RightParenthesisToken){
                if(unusedNodes.length>1){
                    let inbetweenNode: MyNode = unusedNodes.pop()!;
                    let unMatchedParenthesisNode = unusedNodes.pop();
                    if(unMatchedParenthesisNode instanceof UnMatchedParenthesisNode){
                        let parenthesisNode = new ParenthesisNode(inbetweenNode);
                        this.combineNodes(unusedNodes, parenthesisNode);
                    } else if(unMatchedParenthesisNode instanceof UnclosedRSinNode) {
                        let rsinNode = new RSinNode(inbetweenNode);
                        this.combineNodes(unusedNodes, rsinNode);
                    } else if(unMatchedParenthesisNode instanceof UnclosedRCosNode) {
                        let rcosNode = new RCosNode(inbetweenNode);
                        this.combineNodes(unusedNodes, rcosNode);
                    } else if(unMatchedParenthesisNode instanceof UnclosedRTanNode) {
                        let rtanNode = new RTanNode(inbetweenNode);
                        this.combineNodes(unusedNodes, rtanNode);
                    } else if(unMatchedParenthesisNode instanceof UnclosedSinNode) {
                        let sinNode = new SinNode(inbetweenNode);
                        this.combineNodes(unusedNodes, sinNode);
                    } else if(unMatchedParenthesisNode instanceof UnclosedCosNode) {
                        let cosNode = new CosNode(inbetweenNode);
                        this.combineNodes(unusedNodes, cosNode);
                    } else if(unMatchedParenthesisNode instanceof UnclosedTanNode) {
                        let tanNode = new TanNode(inbetweenNode);
                        this.combineNodes(unusedNodes, tanNode);
                    
                    } else {
                        
                        return new ErrorNode();
                    }
                } else {
                    return new ErrorNode();
                }
            } else {
                unusedNodes.push(token.toNode());
            }
        }
        if(unusedNodes.length != 1){
            return new ErrorNode();
        } else {
            let finalNode = unusedNodes.pop()!;
            if(finalNode instanceof UnMatchedNode){
                return new ErrorNode();
            }
            return finalNode;
        }
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
        } else if(topNode instanceof UnMatchedNode){
            unusedNodes.push(topNode!);
            unusedNodes.push(latestNode);
        } else if(topNode instanceof NumberNode){
            unusedNodes.push(new MultiplyNode(topNode, latestNode));
        } else {
            unusedNodes = [new ErrorNode()];
        }
    }
    peek<T>(list:Array<T>): T{
        return list[list.length-1];
    }
}