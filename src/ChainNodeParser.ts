import ts from "./tsAdapter.ts";
import { UnknownNodeError } from "./Error/UnknownNodeError.ts";
import { MutableParser } from "./MutableParser.ts";
import { Context } from "./NodeParser.ts";
import { SubNodeParser } from "./SubNodeParser.ts";
import { BaseType } from "./Type/BaseType.ts";
import { ReferenceType } from "./Type/ReferenceType.ts";

export class ChainNodeParser implements SubNodeParser, MutableParser {
  protected readonly typeCaches = new WeakMap<
    ts.Node,
    Map<string, BaseType | undefined>
  >();

  public constructor(
    protected typeChecker: ts.TypeChecker,
    protected nodeParsers: SubNodeParser[],
  ) {}

  public addNodeParser(nodeParser: SubNodeParser): this {
    this.nodeParsers.push(nodeParser);
    return this;
  }

  public supportsNode(node: ts.Node): boolean {
    return this.nodeParsers.some((nodeParser) => nodeParser.supportsNode(node));
  }

  public createType(
    node: ts.Node,
    context: Context,
    reference?: ReferenceType,
  ): BaseType | undefined {
    let typeCache = this.typeCaches.get(node);
    if (typeCache == null) {
      typeCache = new Map<string, BaseType | undefined>();
      this.typeCaches.set(node, typeCache);
    }
    const contextCacheKey = context.getCacheKey();
    let type = typeCache.get(contextCacheKey);
    if (!type) {
      type = this.getNodeParser(node, context).createType(
        node,
        context,
        reference,
      );
      if (!(type instanceof ReferenceType)) {
        typeCache.set(contextCacheKey, type);
      }
    }
    return type;
  }

  protected getNodeParser(node: ts.Node, context: Context): SubNodeParser {
    for (const nodeParser of this.nodeParsers) {
      if (nodeParser.supportsNode(node)) {
        return nodeParser;
      }
    }

    throw new UnknownNodeError(node, context.getReference());
  }
}
