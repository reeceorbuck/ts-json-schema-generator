import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { AliasType } from "../Type/AliasType.ts";
import { BaseType } from "../Type/BaseType.ts";
import { TypeFormatter } from "../TypeFormatter.ts";

export class AliasTypeFormatter implements SubTypeFormatter {
  public constructor(protected childTypeFormatter: TypeFormatter) {}

  public supportsType(type: AliasType): boolean {
    return type instanceof AliasType;
  }
  public getDefinition(type: AliasType): Definition {
    return this.childTypeFormatter.getDefinition(type.getType());
  }
  public getChildren(type: AliasType): BaseType[] {
    return this.childTypeFormatter.getChildren(type.getType());
  }
}
