import { TestBed } from "@angular/core/testing";
import { MinusNode, MyNode, NegativeNode, NumberNode } from "./Nodes";

describe('MyNode', () => {
    let node: MyNode;
    describe("Eval", () => {
        it("evaluates subtraction with negatives", () => {
            node = new MinusNode(new NumberNode(1), new NegativeNode(new NumberNode(1)))
            expect(node.evaluate()).toEqual(2);
        })
    })
})