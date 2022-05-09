import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { UnknownType } from "../Type/UnknownType.ts";

export class UnknownTypeNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.UnknownKeyword;
  }
  public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
    return new UnknownType();
  }
}
