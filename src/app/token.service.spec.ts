import { TestBed } from '@angular/core/testing';
import { DivisionNode, MinusNode, MultiplyNode, NegativeNode, NumberNode, ParenthesisNode, PlusNode } from './Nodes';

import { TokenService } from './token.service';
import { DivisionToken, LeftParenthesisToken, MinusToken, MultiplyToken, NegativeToken, NumberToken, PlusToken, RightParenthesisToken } from './Tokens';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  describe("Tokenize", () => {
    it("parses plus", () => {
      expect(service.tokenize("+")).toEqual([new PlusToken()]);
    })
    it("parses minus", () => {
      expect(service.tokenize("-")).toEqual([new NegativeToken()]);
    })
    it("parses multiply", () => {
      expect(service.tokenize("*")).toEqual([new MultiplyToken()]);
    })
    it("parses divide", () => {
      expect(service.tokenize("/")).toEqual([new DivisionToken()]);
    })
    it("parses numbers", () => {
      expect(service.tokenize("71")).toEqual([new NumberToken(71)]);
    })
    it("parses expressions with plus", () => {
      expect(service.tokenize("3+4")).toEqual([new NumberToken(3), new PlusToken(), new NumberToken(4)]);
    })
    it("parses expressions with minus", () => {
      expect(service.tokenize("3-4")).toEqual([new NumberToken(3), new MinusToken(), new NumberToken(4)]);
    })
    it("parses expressions with negative", () => {
      expect(service.tokenize("-4")).toEqual([new NegativeToken(), new NumberToken(4)]);
    })
    it("parses expressions with negative and minus", () => {
      expect(service.tokenize("1--4")).toEqual([new NumberToken(1), new MinusToken(), new NegativeToken(), new NumberToken(4)]);
    })
    it("uses parenthesis with addition", () => {
      expect(service.tokenize("2*(1+3)")).toEqual([new NumberToken(2), new MultiplyToken(), new LeftParenthesisToken(), new NumberToken(1), new PlusToken(), new NumberToken(3), new RightParenthesisToken()]);
    })
  })
  describe("Lex", () => {
    it("builds addition tree", () => {
      expect(service.lex([new NumberToken(1), new PlusToken(), new NumberToken(2)]))
        .toEqual(new PlusNode(new NumberNode(1), new NumberNode(2)));
    })
    it("builds subtraction tree", () => {
      expect(service.lex([new NumberToken(3), new MinusToken(), new NumberToken(1)]))
        .toEqual(new MinusNode(new NumberNode(3), new NumberNode(1)));
    })
    it("builds multiplication tree", () => {
      expect(service.lex([new NumberToken(3), new MultiplyToken(), new NumberToken(1)]))
        .toEqual(new MultiplyNode(new NumberNode(3), new NumberNode(1)));
    })
    it("builds division tree", () => {
      expect(service.lex([new NumberToken(1), new DivisionToken(), new NumberToken(2)]))
        .toEqual(new DivisionNode(new NumberNode(1), new NumberNode(2)));
    })
    it("performs multiplication before subtraction", () => {
      expect(service.lex([new NumberToken(4), new MinusToken(), new NumberToken(2), new MultiplyToken(), new NumberToken(3)]))
      .toEqual(new MinusNode(new NumberNode(4), new MultiplyNode(new NumberNode(2), new NumberNode(3))))
    })  
    it("does subtraction with negatives", () => {
      let actual = service.lex([new NumberToken(1), new MinusToken(), new NegativeToken(), new NumberToken(2)]);
      let expected = new MinusNode(new NumberNode(1), new NegativeNode(new NumberNode(2)));
      // console.log("actual:", actual.display());
      // console.log("expected:", expected.display());
      expect(actual).toEqual(expected);
    })
    it("builds tree with parenthesis", () => {
      let actual = service.lex([new NumberToken(2), new MultiplyToken(), new LeftParenthesisToken(), new NumberToken(1), new PlusToken(), new NumberToken(3), new RightParenthesisToken()]);
      let expected = new MultiplyNode(new NumberNode(2), new ParenthesisNode(new PlusNode(new NumberNode(1), new NumberNode(3))));
      console.log("actual:", actual.display());
      console.log("expected:", expected.display());
      expect(service.lex([new NumberToken(2), new MultiplyToken(), new LeftParenthesisToken(), new NumberToken(1), new PlusToken(), new NumberToken(3), new RightParenthesisToken()]))
      .toEqual(new MultiplyNode(new NumberNode(2), new ParenthesisNode(new PlusNode(new NumberNode(1), new NumberNode(3)))));
    }) 
  })
});
