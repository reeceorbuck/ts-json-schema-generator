import { PrimitiveType } from "./PrimitiveType.ts";

export class StringType extends PrimitiveType {
  public getId(): string {
    return "string";
  }
}
