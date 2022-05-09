import { BaseType } from "./BaseType.ts";

export class NeverType extends BaseType {
  public getId(): string {
    return "never";
  }
}
