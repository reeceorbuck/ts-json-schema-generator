import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { NumberType } from "../Type/NumberType.ts";

export class NumberTypeNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.NumberKeyword;
  }
  public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
    return new NumberType();
  }
}
