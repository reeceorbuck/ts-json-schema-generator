import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { NeverType } from "../Type/NeverType.ts";

export class NeverTypeFormatter implements SubTypeFormatter {
  public supportsType(type: NeverType): boolean {
    return type instanceof NeverType;
  }
  public getDefinition(type: NeverType): Definition {
    return { not: {} };
  }
  public getChildren(type: NeverType): BaseType[] {
    return [];
  }
}
