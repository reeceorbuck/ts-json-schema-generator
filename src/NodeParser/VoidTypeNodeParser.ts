import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { VoidType } from "../Type/VoidType.ts";

export class VoidTypeNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.VoidKeyword;
  }
  public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
    return new VoidType();
  }
}
