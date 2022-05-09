import ts from "./tsAdapter.ts";
import { Context } from "./NodeParser.ts";
import { SubNodeParser } from "./SubNodeParser.ts";
import { BaseType } from "./Type/BaseType.ts";
import { DefinitionType } from "./Type/DefinitionType.ts";
import { ReferenceType } from "./Type/ReferenceType.ts";
import { hasJsDocTag } from "./Utils/hasJsDocTag.ts";
import { symbolAtNode } from "./Utils/symbolAtNode.ts";

export class ExposeNodeParser implements SubNodeParser {
  public constructor(
    protected typeChecker: ts.TypeChecker,
    protected subNodeParser: SubNodeParser,
    protected expose: "all" | "none" | "export",
    protected jsDoc: "none" | "extended" | "basic",
  ) {}

  public supportsNode(node: ts.Node): boolean {
    return this.subNodeParser.supportsNode(node);
  }

  public createType(
    node: ts.Node,
    context: Context,
    reference?: ReferenceType,
  ): BaseType | undefined {
    const baseType = this.subNodeParser.createType(node, context, reference);

    if (baseType === undefined) {
      return undefined;
    }

    if (!this.isExportNode(node)) {
      return baseType;
    }

    return new DefinitionType(this.getDefinitionName(node, context), baseType);
  }

  protected isExportNode(node: ts.Node): boolean {
    if (this.expose === "all") {
      return node.kind !== ts.SyntaxKind.TypeLiteral;
    } else if (this.expose === "none") {
      return false;
    } else if (this.jsDoc !== "none" && hasJsDocTag(node, "internal")) {
      return false;
    }

    const localSymbol: ts.Symbol = (node as any).localSymbol;
    return localSymbol ? "exportSymbol" in localSymbol : false;
  }

  protected getDefinitionName(node: ts.Node, context: Context): string {
    const symbol = symbolAtNode(node)!;
    const fullName = this.typeChecker.getFullyQualifiedName(symbol).replace(
      /^".*"\./,
      "",
    );
    const argumentIds = context.getArguments().map((arg) => arg?.getName());

    return argumentIds.length
      ? `${fullName}<${argumentIds.join(",")}>`
      : fullName;
  }
}
