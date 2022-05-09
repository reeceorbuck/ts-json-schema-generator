import ts from "../tsAdapter.ts";

import { NodeParser } from "../NodeParser.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { getKey } from "../Utils/nodeKey.ts";
import { ObjectProperty, ObjectType } from "../Type/ObjectType.ts";

export class ObjectLiteralExpressionNodeParser implements SubNodeParser {
  public constructor(protected childNodeParser: NodeParser) {}

  public supportsNode(node: ts.ObjectLiteralExpression): boolean {
    return node.kind === ts.SyntaxKind.ObjectLiteralExpression;
  }

  public createType(
    node: ts.ObjectLiteralExpression,
    context: Context,
  ): BaseType | undefined {
    if (node.properties) {
      const properties = node.properties.map(
        (t) =>
          new ObjectProperty(
            t.name!.getText(),
            this.childNodeParser.createType((t as any).initializer, context),
            !(t as any).questionToken,
          ),
      );

      return new ObjectType(
        `object-${getKey(node, context)}`,
        [],
        properties,
        false,
      );
    }

    // TODO: implement this?
    return undefined;
  }
}
