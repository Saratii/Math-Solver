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
        return "⋅"
    }
    operation: string = "⋅"
}
export class DivisionToken extends Token{
    public toString(): string {
        return "/"
    }
    operation: string = "/"
}

