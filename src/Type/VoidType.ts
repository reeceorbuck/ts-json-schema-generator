import { BaseType } from "./BaseType.ts";

export class VoidType extends BaseType {
  public getId(): string {
    return "void";
  }
}
