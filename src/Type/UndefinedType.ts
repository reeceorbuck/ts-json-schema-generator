import { BaseType } from "./BaseType.ts";

export class UndefinedType extends BaseType {
  public getId(): string {
    return "undefined";
  }
}
