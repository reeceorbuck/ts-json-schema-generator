import ts from "../tsAdapter.ts";

import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { ArrayType } from "../Type/ArrayType.ts";
import { BaseType } from "../Type/BaseType.ts";
import { RestType } from "../Type/RestType.ts";

export class RestTypeNodeParser implements SubNodeParser {
  public constructor(protected childNodeParser: NodeParser) {}
  public supportsNode(node: ts.RestTypeNode): boolean {
    return node.kind === ts.SyntaxKind.RestType;
  }
  public createType(node: ts.RestTypeNode, context: Context): BaseType {
    return new RestType(
      this.childNodeParser.createType(node.type, context) as ArrayType,
    );
  }
}
