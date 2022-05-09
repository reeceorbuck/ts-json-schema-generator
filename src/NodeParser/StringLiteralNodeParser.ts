import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { LiteralType } from "../Type/LiteralType.ts";

export class StringLiteralNodeParser implements SubNodeParser {
  public supportsNode(node: ts.StringLiteral): boolean {
    return node.kind === ts.SyntaxKind.StringLiteral;
  }
  public createType(node: ts.StringLiteral, context: Context): BaseType {
    return new LiteralType(node.text);
  }
}
