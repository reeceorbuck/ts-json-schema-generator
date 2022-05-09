import { BaseType } from "./BaseType.ts";
import { LiteralType } from "./LiteralType.ts";
import { NullType } from "./NullType.ts";

export type EnumValue = string | boolean | number | null;

export class EnumType extends BaseType {
  private types: BaseType[];

  public constructor(private id: string, private values: readonly EnumValue[]) {
    super();
    this.types = values.map((
      value,
    ) => (value == null ? new NullType() : new LiteralType(value)));
  }

  public getId(): string {
    return this.id;
  }

  public getValues(): readonly EnumValue[] {
    return this.values;
  }

  public getTypes(): BaseType[] {
    return this.types;
  }
}
