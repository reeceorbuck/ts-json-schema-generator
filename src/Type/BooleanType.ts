import { PrimitiveType } from "./PrimitiveType.ts";

export class BooleanType extends PrimitiveType {
  public getId(): string {
    return "boolean";
  }
}
