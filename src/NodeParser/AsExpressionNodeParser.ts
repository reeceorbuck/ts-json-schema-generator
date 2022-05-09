import ts from "../tsAdapter.ts";

import { NodeParser } from "../NodeParser.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";

export class AsExpressionNodeParser implements SubNodeParser {
  public constructor(protected childNodeParser: NodeParser) {}

  public supportsNode(node: ts.AsExpression): boolean {
    return node.kind === ts.SyntaxKind.AsExpression;
  }
  public createType(
    node: ts.AsExpression,
    context: Context,
  ): BaseType | undefined {
    // only implement `as const` for now where we just ignore the as expression
    return this.childNodeParser.createType(node.expression, context);
  }
}
