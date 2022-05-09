import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { NullType } from "../Type/NullType.ts";

export class UndefinedLiteralNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.UndefinedKeyword;
  }
  public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
    return new NullType();
  }
}
