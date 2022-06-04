export abstract class MyNode{
    abstract evaluate(): number | undefined;
    abstract priority: number;
    abstract display(): string;
}
export abstract class BinaryOperationNode extends MyNode{
    left?: MyNode;
    right?: MyNode;
    public constructor(left?:MyNode, right?:MyNode){
        super();
        this.left = left;
        this.right = right;
    }
}
export class PlusNode extends BinaryOperationNode{
    priority = 1;
    evaluate(): number | undefined{
        let left = this.left?.evaluate();
        let right = this.right?.evaluate();
        if(left === undefined || right === undefined){
            return undefined;
        }
        return left + right;
    }
    display(): string{
        return "{" + this.left?.display() + " + " + this.right?.display() + "}";
    }
}
export class MinusNode extends BinaryOperationNode{
    priority = 1;
    evaluate(): number | undefined{
        let left = this.left?.evaluate();
        let right = this.right?.evaluate();
        if(left === undefined || right === undefined){
            return undefined;
        }
        return left-right;
    }
    display(): string{
        return "{" + this.left?.display() + " - " + this.right?.display() + "}";
    }
    
}
export class MultiplyNode extends BinaryOperationNode{
    priority = 2;
    evaluate(): number | undefined{
        let left = this.left?.evaluate();
        let right = this.right?.evaluate();
        if(left === undefined || right === undefined){
            return undefined;
        }
        return left * right;
    }
    display(): string{
        return "{" + this.left?.display() + " * " + this.right?.display() + "}";
    }
}
export class DivisionNode extends BinaryOperationNode{
    priority = 2;
    evaluate(): number | undefined{
        let right = this.right?.evaluate();
        let left = this.left?.evaluate();
        if(right === 0 || right === undefined || left === undefined){
            return undefined;
        }
        return left / right;
    }
    display(): string{
        return "{" + this.left?.display() + " / " + this.right?.display() + "}";
    }
}
export class ExponentNode extends BinaryOperationNode{
    priority = 4;
    evaluate(): number | undefined{
        let right = this.right?.evaluate();
        let left = this.left?.evaluate();
        
        return left! ** right!;
    }
    display(): string{
        return "{" + this.left?.display() + " ^ " + this.right?.display() + "}";
    }
}
export class ModulusNode extends BinaryOperationNode{
    priority = 2;
    evaluate(): number | undefined{
        let right = this.right?.evaluate();
        let left = this.left?.evaluate();
        
        return left! % right!;
    }
    display(): string{
        return "{" + this.left?.display() + " % " + this.right?.display() + "}";
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

export abstract class UnaryOperationNode{
    child?: MyNode;
    constructor(child?:MyNode){
        this.child = child;
    }
}
export class NegativeNode extends UnaryOperationNode{
    priority = 69;
    evaluate(): number | undefined{
        let child = this.child?.evaluate();
        if(child === undefined){
            return undefined;
        }
        return child * -1; 
    }
    display(): string{
        return "neg(" + this.child?.display() + ")";
    }
}
export class UnMatchedParenthesisNode extends MyNode{
    priority: number = 68;
    evaluate(): number | undefined {
        return undefined;
    }
    display(): string {
        return "(";
    }
}
export class ParenthesisNode extends UnaryOperationNode{
    priority = 68;
    evaluate(): number | undefined{
        return this.child?.evaluate(); 
    }
    display(): string{
        return "(" + this.child?.display() + ")";
    }
}
export class ErrorNode extends MyNode{
    priority = 420;
    evaluate(): number | undefined {
        return undefined;
    }
    display(): string{
        return "Error write it correctly";
    }
}