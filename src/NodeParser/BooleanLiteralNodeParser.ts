import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { LiteralType } from "../Type/LiteralType.ts";

export class BooleanLiteralNodeParser implements SubNodeParser {
  public supportsNode(node: ts.BooleanLiteral): boolean {
    return node.kind === ts.SyntaxKind.TrueKeyword ||
      node.kind === ts.SyntaxKind.FalseKeyword;
  }
  public createType(node: ts.BooleanLiteral, context: Context): BaseType {
    return new LiteralType(node.kind === ts.SyntaxKind.TrueKeyword);
  }
}
