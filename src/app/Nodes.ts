export abstract class MyNode{
    abstract evaluate(): number;
}
export abstract class BinaryOperationNode extends MyNode{
    left!: MyNode;
    right!: MyNode;
}
export class PlusNode extends BinaryOperationNode{
    evaluate(): number {
        return this.left.evaluate() + this.right.evaluate();
    }
}
export class MinusNode extends BinaryOperationNode{
    evaluate(): number {
        return parseFloat((this.left.evaluate() - this.right.evaluate()).toFixed(10));
    }
}
export class NumberNode extends MyNode{
    val: number;
    constructor(val:number){
        super();
        this.val = val;
    }
    evaluate(): number{
        return this.val;
    }
}