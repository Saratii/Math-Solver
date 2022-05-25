import { Component, OnInit } from '@angular/core';
import { MyNode } from '../Nodes';
import { TokenService } from '../token.service';
import { Token } from '../Tokens';

@Component({
  selector: 'app-maff-asker',
  templateUrl: './maff-asker.component.html',
  styleUrls: ['./maff-asker.component.css']
})
export class MaffAskerComponent implements OnInit {

  askerBox = "";
  tokens: Token[] = [];
  AST!: MyNode;
  value?: string = "";

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
  }
  calculate(): void {
    this.tokens = this.tokenService.tokenize(this.askerBox);
    console.log(this.tokens);
    this.AST = this.tokenService.lex(this.tokens);
    console.log(this.AST);
    this.value = this.AST.evaluate() + "";
  }
}