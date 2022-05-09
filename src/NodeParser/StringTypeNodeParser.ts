import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { StringType } from "../Type/StringType.ts";

export class StringTypeNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.StringKeyword;
  }

  public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
    return new StringType();
  }
}
