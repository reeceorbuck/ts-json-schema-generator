import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { NeverType } from "../Type/NeverType.ts";

export class NeverTypeNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.NeverKeyword;
  }
  public createType(
    node: ts.KeywordTypeNode,
    context: Context,
  ): BaseType | undefined {
    return new NeverType();
  }
}
