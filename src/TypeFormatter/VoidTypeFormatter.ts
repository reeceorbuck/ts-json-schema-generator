import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { VoidType } from "../Type/VoidType.ts";

export class VoidTypeFormatter implements SubTypeFormatter {
  public supportsType(type: VoidType): boolean {
    return type instanceof VoidType;
  }
  public getDefinition(type: VoidType): Definition {
    return { type: "null" };
  }
  public getChildren(type: VoidType): BaseType[] {
    return [];
  }
}
