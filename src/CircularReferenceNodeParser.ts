import ts from "./tsAdapter.ts";
import { Context } from "./NodeParser.ts";
import { SubNodeParser } from "./SubNodeParser.ts";
import { BaseType } from "./Type/BaseType.ts";
import { ReferenceType } from "./Type/ReferenceType.ts";
import { getKey } from "./Utils/nodeKey.ts";

export class CircularReferenceNodeParser implements SubNodeParser {
  protected circular = new Map<string, BaseType>();

  public constructor(protected childNodeParser: SubNodeParser) {}

  public supportsNode(node: ts.Node): boolean {
    return this.childNodeParser.supportsNode(node);
  }
  public createType(node: ts.Node, context: Context): BaseType | undefined {
    const key = getKey(node, context);
    if (this.circular.has(key)) {
      return this.circular.get(key)!;
    }

    const reference = new ReferenceType();
    this.circular.set(key, reference);
    const type = this.childNodeParser.createType(node, context, reference);
    if (type) {
      reference.setType(type);
    }
    this.circular.delete(key);

    return type;
  }
}
