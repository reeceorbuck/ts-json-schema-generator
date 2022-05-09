import ts from "../tsAdapter.ts";
import { NodeParser } from "../NodeParser.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";

export class ParameterParser implements SubNodeParser {
  constructor(protected childNodeParser: NodeParser) {}

  public supportsNode(node: ts.ParameterDeclaration): boolean {
    return node.kind === ts.SyntaxKind.Parameter;
  }
  public createType(
    node: ts.FunctionTypeNode,
    context: Context,
  ): BaseType | undefined {
    return this.childNodeParser.createType(node.type, context);
  }
}
