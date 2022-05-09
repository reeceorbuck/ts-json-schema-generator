import ts from "../tsAdapter.ts";

import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { TupleType } from "../Type/TupleType.ts";

export class TupleNodeParser implements SubNodeParser {
  public constructor(
    protected typeChecker: ts.TypeChecker,
    protected childNodeParser: NodeParser,
  ) {}

  public supportsNode(node: ts.TupleTypeNode): boolean {
    return node.kind === ts.SyntaxKind.TupleType;
  }

  public createType(node: ts.TupleTypeNode, context: Context): BaseType {
    return new TupleType(
      node.elements.map((item) => {
        return this.childNodeParser.createType(item, context);
      }),
    );
  }
}
