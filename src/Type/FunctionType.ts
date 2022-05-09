import { BaseType } from "./BaseType.ts";

export class FunctionType extends BaseType {
  public getId(): string {
    return "function";
  }
}
