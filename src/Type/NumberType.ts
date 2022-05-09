import { PrimitiveType } from "./PrimitiveType.ts";

export class NumberType extends PrimitiveType {
  public getId(): string {
    return "number";
  }
}
