import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { LiteralType } from "../Type/LiteralType.ts";

export class NumberLiteralNodeParser implements SubNodeParser {
  public supportsNode(node: ts.NumericLiteral): boolean {
    return node.kind === ts.SyntaxKind.NumericLiteral;
  }
  public createType(node: ts.NumericLiteral, context: Context): BaseType {
    return new LiteralType(parseFloat(node.text));
  }
}
