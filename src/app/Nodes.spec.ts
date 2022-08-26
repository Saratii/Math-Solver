import { TestBed } from "@angular/core/testing";
import { MinusNode, MyNode, NegativeNode, NumberNode, RSinNode, SinNode } from "./Nodes";

describe('MyNode', () => {
    let node: MyNode;
    describe("Eval", () => {
        it("evaluates subtraction with negatives", () => {
            node = new MinusNode(new NumberNode(1), new NegativeNode(new NumberNode(1)))
            expect(node.evaluate()).toEqual(2);
        })
        it("evaluates sin(90)", () => {
            node = new SinNode(new NumberNode(90));
            expect(node.evaluate()).toEqual(1);
        })
        it("evaluates rsin(90)", () => {
            node = new RSinNode(new NumberNode(0));
            expect(node.evaluate()).toEqual(0);
        })
    })
})