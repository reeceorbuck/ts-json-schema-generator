import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { SymbolType } from "../Type/SymbolType.ts";
import { BaseType } from "../Type/BaseType.ts";

export class SymbolTypeFormatter implements SubTypeFormatter {
  public supportsType(type: SymbolType): boolean {
    return type instanceof SymbolType;
  }
  public getDefinition(type: SymbolType): Definition {
    return {};
  }
  public getChildren(type: SymbolType): BaseType[] {
    return [];
  }
}
