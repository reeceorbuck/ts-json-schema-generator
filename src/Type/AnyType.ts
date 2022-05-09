import { BaseType } from "./BaseType.ts";

export class AnyType extends BaseType {
  public getId(): string {
    return "any";
  }
}
