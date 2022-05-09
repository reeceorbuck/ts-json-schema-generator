import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { NullType } from "../Type/NullType.ts";

export class NullTypeFormatter implements SubTypeFormatter {
  public supportsType(type: NullType): boolean {
    return type instanceof NullType;
  }
  public getDefinition(type: NullType): Definition {
    return { type: "null" };
  }
  public getChildren(type: NullType): BaseType[] {
    return [];
  }
}
