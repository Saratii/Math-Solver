export abstract class MyNode{
    abstract evaluate(): number | undefined;
    abstract priority: number;
    abstract display(): string;
}
export abstract class BinaryOperationNode extends MyNode{
    left!: MyNode;
    right!: MyNode;
}
export class PlusNode extends BinaryOperationNode{
    priority = 1;
    evaluate(): number | undefined{
        let left = this.left.evaluate();
        let right = this.right.evaluate();
        if(left === undefined || right === undefined){
            return undefined;
        }
        return left + right;
    }
    display(): string{
        return "{+ " + this.left.display() + ", " + this.right.display() + "}";
    }
}
export class MinusNode extends BinaryOperationNode{
    priority = 1;
    evaluate(): number | undefined{
        let left = this.left.evaluate();
        let right = this.right.evaluate();
        if(left === undefined || right === undefined){
            return undefined;
        }
        return left-right;
    }
    display(): string{
        return "{- " + this.left.display() + ", " + this.right.display() + "}";
    }
}
export class MultiplyNode extends BinaryOperationNode{
    priority = 2;
    evaluate(): number | undefined{
        let left = this.left.evaluate();
        let right = this.right.evaluate();
        if(left === undefined || right === undefined){
            return undefined;
        }
        return left * right;
    }
    display(): string{
        return "{* " + this.left.display() + ", " + this.right.display() + "}";
    }
}
export class DivisionNode extends BinaryOperationNode{
    priority = 2;
    evaluate(): number | undefined{
        let right = this.right.evaluate();
        let left = this.left.evaluate();
        if(right === 0 || right === undefined || left === undefined){
            return undefined;
        }
        return left / right;
    }
    display(): string{
        return "{/ " + this.left.display() + ", " + this.right.display() + "}";
    }
}
export class NumberNode extends MyNode{
    priority = 69;
    val: number;
    constructor(val:number){
        super();
        this.val = val;
    }
    evaluate(): number{
        return this.val;
    }
    display(): string{
        return this.val + "";
    }
}