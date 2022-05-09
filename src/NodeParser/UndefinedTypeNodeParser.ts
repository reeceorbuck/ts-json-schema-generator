import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { UndefinedType } from "../Type/UndefinedType.ts";

export class UndefinedTypeNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.UndefinedKeyword;
  }
  public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
    return new UndefinedType();
  }
}
