import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { NullType } from "../Type/NullType.ts";

export class NullLiteralNodeParser implements SubNodeParser {
  public supportsNode(node: ts.NullLiteral): boolean {
    return node.kind === ts.SyntaxKind.NullKeyword;
  }
  public createType(node: ts.NullLiteral, context: Context): BaseType {
    return new NullType();
  }
}
