import ts from "../tsAdapter.ts";

import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";

export class PropertyAccessExpressionParser implements SubNodeParser {
  public constructor(
    protected typeChecker: ts.TypeChecker,
    protected childNodeParser: NodeParser,
  ) {}

  public supportsNode(node: ts.PropertyAccessExpression): boolean {
    return node.kind === ts.SyntaxKind.PropertyAccessExpression;
  }

  public createType(
    node: ts.PropertyAccessExpression,
    context: Context,
  ): BaseType | undefined {
    const type = this.typeChecker.getTypeAtLocation(node);
    return this.childNodeParser.createType(
      type.symbol.declarations![0],
      context,
    );
  }
}
