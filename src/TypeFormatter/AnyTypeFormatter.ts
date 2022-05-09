import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { AnyType } from "../Type/AnyType.ts";
import { BaseType } from "../Type/BaseType.ts";

export class AnyTypeFormatter implements SubTypeFormatter {
  public supportsType(type: AnyType): boolean {
    return type instanceof AnyType;
  }
  public getDefinition(type: AnyType): Definition {
    return {};
  }
  public getChildren(type: AnyType): BaseType[] {
    return [];
  }
}
