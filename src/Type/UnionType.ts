import { BaseType } from "./BaseType.ts";
import { uniqueTypeArray } from "../Utils/uniqueTypeArray.ts";
import { NeverType } from "./NeverType.ts";

export class UnionType extends BaseType {
  private readonly types: BaseType[];

  public constructor(types: readonly (BaseType | undefined)[]) {
    super();
    this.types = uniqueTypeArray(
      types.reduce((flatTypes, type) => {
        if (type instanceof UnionType) {
          flatTypes.push(...type.getTypes());
        } else if (type !== undefined && !(type instanceof NeverType)) {
          flatTypes.push(type);
        }
        return flatTypes;
      }, [] as BaseType[]),
    );
  }

  public getId(): string {
    return `(${this.types.map((type) => type.getId()).join("|")})`;
  }

  public getName(): string {
    return `(${this.types.map((type) => type.getName()).join("|")})`;
  }

  public getTypes(): BaseType[] {
    return this.types;
  }

  public normalize(): BaseType | undefined {
    if (this.types.length === 0) {
      return undefined;
    } else if (this.types.length === 1) {
      return this.types[0];
    } else {
      return this;
    }
  }
}
