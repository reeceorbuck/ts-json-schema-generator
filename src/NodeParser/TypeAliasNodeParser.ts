import ts from "../tsAdapter.ts";

import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { AliasType } from "../Type/AliasType.ts";
import { BaseType } from "../Type/BaseType.ts";
import { ReferenceType } from "../Type/ReferenceType.ts";
import { getKey } from "../Utils/nodeKey.ts";

export class TypeAliasNodeParser implements SubNodeParser {
  public constructor(
    protected typeChecker: ts.TypeChecker,
    protected childNodeParser: NodeParser,
  ) {}

  public supportsNode(node: ts.TypeAliasDeclaration): boolean {
    return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
  }

  public createType(
    node: ts.TypeAliasDeclaration,
    context: Context,
    reference?: ReferenceType,
  ): BaseType | undefined {
    if (node.typeParameters?.length) {
      for (const typeParam of node.typeParameters) {
        const nameSymbol = this.typeChecker.getSymbolAtLocation(
          typeParam.name,
        )!;
        context.pushParameter(nameSymbol.name);

        if (typeParam.default) {
          const type = this.childNodeParser.createType(
            typeParam.default,
            context,
          );
          context.setDefault(nameSymbol.name, type);
        }
      }
    }

    const id = this.getTypeId(node, context);
    const name = this.getTypeName(node, context);
    if (reference) {
      reference.setId(id);
      reference.setName(name);
    }

    const type = this.childNodeParser.createType(node.type, context);
    if (type === undefined) {
      return undefined;
    }
    return new AliasType(id, type);
  }

  protected getTypeId(node: ts.TypeAliasDeclaration, context: Context): string {
    return `alias-${getKey(node, context)}`;
  }

  protected getTypeName(
    node: ts.TypeAliasDeclaration,
    context: Context,
  ): string {
    const argumentIds = context.getArguments().map((arg) => arg?.getName());
    const fullName = node.name.getText();

    return argumentIds.length
      ? `${fullName}<${argumentIds.join(",")}>`
      : fullName;
  }
}
