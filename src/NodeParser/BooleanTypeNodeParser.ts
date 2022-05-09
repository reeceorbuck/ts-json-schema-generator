import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { BooleanType } from "../Type/BooleanType.ts";

export class BooleanTypeNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.BooleanKeyword;
  }
  public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
    return new BooleanType();
  }
}
