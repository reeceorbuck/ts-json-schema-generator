import ts from "./tsAdapter.ts";
import { Context, NodeParser } from "./NodeParser.ts";
import { BaseType } from "./Type/BaseType.ts";
import { DefinitionType } from "./Type/DefinitionType.ts";

export class TopRefNodeParser implements NodeParser {
  public constructor(
    protected childNodeParser: NodeParser,
    protected fullName: string | undefined,
    protected topRef: boolean,
  ) {}

  public createType(node: ts.Node, context: Context): BaseType | undefined {
    const baseType = this.childNodeParser.createType(node, context);

    if (baseType === undefined) {
      return undefined;
    }

    if (this.topRef && !(baseType instanceof DefinitionType)) {
      return new DefinitionType(this.fullName, baseType);
    } else if (!this.topRef && baseType instanceof DefinitionType) {
      return baseType.getType();
    } else {
      return baseType;
    }
  }
}
