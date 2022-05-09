import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { DefinitionType } from "../Type/DefinitionType.ts";
import { TypeFormatter } from "../TypeFormatter.ts";
import { uniqueArray } from "../Utils/uniqueArray.ts";

export class DefinitionTypeFormatter implements SubTypeFormatter {
  public constructor(
    protected childTypeFormatter: TypeFormatter,
    protected encodeRefs: boolean,
  ) {}

  public supportsType(type: DefinitionType): boolean {
    return type instanceof DefinitionType;
  }
  public getDefinition(type: DefinitionType): Definition {
    const ref = type.getName();
    return {
      $ref: `#/definitions/${this.encodeRefs ? encodeURIComponent(ref) : ref}`,
    };
  }
  public getChildren(type: DefinitionType): BaseType[] {
    return uniqueArray([
      type,
      ...this.childTypeFormatter.getChildren(type.getType()),
    ]);
  }
}
