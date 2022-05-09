import { UnknownTypeError } from "./Error/UnknownTypeError.ts";
import { MutableTypeFormatter } from "./MutableTypeFormatter.ts";
import { Definition } from "./Schema/Definition.ts";
import { SubTypeFormatter } from "./SubTypeFormatter.ts";
import { BaseType } from "./Type/BaseType.ts";

export class ChainTypeFormatter
  implements SubTypeFormatter, MutableTypeFormatter {
  public constructor(protected typeFormatters: SubTypeFormatter[]) {}

  public addTypeFormatter(typeFormatter: SubTypeFormatter): this {
    this.typeFormatters.push(typeFormatter);
    return this;
  }

  public supportsType(type: BaseType): boolean {
    return this.typeFormatters.some((typeFormatter) =>
      typeFormatter.supportsType(type)
    );
  }
  public getDefinition(type: BaseType): Definition {
    return this.getTypeFormatter(type).getDefinition(type);
  }
  public getChildren(type: BaseType): BaseType[] {
    return this.getTypeFormatter(type).getChildren(type);
  }

  protected getTypeFormatter(type: BaseType): SubTypeFormatter {
    for (const typeFormatter of this.typeFormatters) {
      if (typeFormatter.supportsType(type)) {
        return typeFormatter;
      }
    }

    throw new UnknownTypeError(type);
  }
}
