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
  value!: number;

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
  }
  calculate(): void {
    this.tokens = this.tokenService.tokenize(this.askerBox);
    this.AST = this.tokenService.lex(this.tokens);
    this.value = this.AST.evaluate();
  }
}