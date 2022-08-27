import { CosNode, DivisionNode, ExponentNode, MinusNode, ModulusNode, MultiplyNode, MyNode, NegativeNode, NumberNode, PlusNode, RCosNode, RSinNode, RTanNode, SinNode, TanNode, UnclosedCosNode, UnclosedRCosNode, UnclosedRSinNode, UnclosedRTanNode, UnclosedSinNode, UnclosedTanNode } from "./Nodes";

export abstract class Token{
    public abstract toString(): string;
    public abstract toNode(): MyNode;
}
export class NumberToken extends Token{
    public toString(): string {
        return this.val +"";
    }
    val: number;
    constructor(val: number){
        super();
        this.val = val;
    }
    public toNode(): NumberNode {
        return new NumberNode(this.val);
    }
}
export class PlusToken extends Token{
    public toString(): string {
        return "+";
    }
    operation: string = "+";
    public toNode(): PlusNode {
        return new PlusNode();
    }
}

export class MinusToken extends Token{
    public toString(): string {
        return "-";
    }
    operation: string = "-";
    public toNode(): MinusNode {
        return new MinusNode();
    }
}
export class MultiplyToken extends Token{
    public toString(): string {
        return "⋅";
    }
    operation: string = "⋅";
    public toNode(): MultiplyNode {
        return new MultiplyNode();
    }
}
export class DivisionToken extends Token{
    public toString(): string {
        return "/";
    }
    operation: string = "/";
    public toNode(): DivisionNode {
        return new DivisionNode();
    }
}
export class NegativeToken extends Token{
    public toString(): string {
        return "neg";
    }
    operation: string = "neg";
    public toNode(): NegativeNode {
        return new NegativeNode();
    }
}
export class LeftParenthesisToken extends Token{
    public toNode(): MyNode {
        throw new Error("Method not implemented.");
    }
    public toString(): string {
        return "("
    }
    operation: string = "(";
}
export class RightParenthesisToken extends Token{
    public toNode(): MyNode {
        throw new Error("Method not implemented.");
    }
    public toString(): string {
        return ")"
    }
    operation: string = ")";
}
export class ExponentToken extends Token{
    public toNode(): MyNode {
        return new ExponentNode();
    }
    public toString(): string {
        return "^"
    }
}
export class ModulusToken extends Token{
    public toNode(): MyNode {
        return new ModulusNode();
    }
    public toString(): string {
        return "%"
    }
}
export class SinToken extends Token{
    public toNode(): MyNode {
        return new UnclosedSinNode();
    }
    public toString(): string {
        return "sin("
    }
}
export class CosToken extends Token{
    public toNode(): MyNode {
        return new UnclosedCosNode();
    }
    public toString(): string {
        return "cos("
    }
}
export class TanToken extends Token{
    public toNode(): MyNode {
        return new UnclosedTanNode();
    }
    public toString(): string {
        return "tan("
    }
}
export class RSinToken extends Token{
    public toNode(): MyNode {
        return new UnclosedRSinNode();
    }
    public toString(): string {
        return "rsin("
    }
}
export class RCosToken extends Token{
    public toNode(): MyNode {
        return new UnclosedRCosNode();
    }
    public toString(): string {
        return "rcos("
    }
}
export class RTanToken extends Token{
    public toNode(): MyNode {
        return new UnclosedRTanNode();
    }
    public toString(): string {
        return "rtan("
    }
}