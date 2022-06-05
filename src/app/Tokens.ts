export abstract class Token{
    public abstract toString(): string;
    
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
}
export class PlusToken extends Token{
    public toString(): string {
        return "+";
    }
    operation: string = "+";
}

export class MinusToken extends Token{
    public toString(): string {
        return "-";
    }
    operation: string = "-";
}
export class MultiplyToken extends Token{
    public toString(): string {
        return "⋅";
    }
    operation: string = "⋅";
}
export class DivisionToken extends Token{
    public toString(): string {
        return "/";
    }
    operation: string = "/";
}
export class NegativeToken extends Token{
    public toString(): string {
        return "neg";
    }
    operation: string = "neg";
}
export class LeftParenthesisToken extends Token{
    public toString(): string {
        return "("
    }
    operation: string = "(";
}
export class RightParenthesisToken extends Token{
    public toString(): string {
        return ")"
    }
    operation: string = ")";
}
export class ExponentToken extends Token{
    public toString(): string {
        return "^"
    }
}
export class ModulusToken extends Token{
    public toString(): string {
        return "%"
    }
}
export class SinToken extends Token{
    public toString(): string {
        return "sin("
    }
}
export class CosToken extends Token{
    public toString(): string {
        return "cos("
    }
}
export class TanToken extends Token{
    public toString(): string {
        return "tan("
    }
}
