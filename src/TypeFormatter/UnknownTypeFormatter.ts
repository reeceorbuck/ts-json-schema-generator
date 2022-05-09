import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { UnknownType } from "../Type/UnknownType.ts";

export class UnknownTypeFormatter implements SubTypeFormatter {
  public supportsType(type: UnknownType): boolean {
    return type instanceof UnknownType;
  }
  public getDefinition(type: UnknownType): Definition {
    return {};
  }
  public getChildren(type: UnknownType): BaseType[] {
    return [];
  }
}
