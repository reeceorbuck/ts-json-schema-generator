import { ArrayType } from "./ArrayType.ts";
import { BaseType } from "./BaseType.ts";

export class RestType extends BaseType {
  public constructor(private item: ArrayType) {
    super();
  }

  public getId(): string {
    return `...${this.item.getId()}`;
  }

  public getType(): ArrayType {
    return this.item;
  }
}
