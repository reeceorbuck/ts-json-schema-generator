import { PrimitiveType } from "./PrimitiveType.ts";

export class NullType extends PrimitiveType {
  public getId(): string {
    return "null";
  }
}
