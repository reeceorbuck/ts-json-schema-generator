import { BaseType } from "./BaseType.ts";

export class UnknownType extends BaseType {
  public getId(): string {
    return "unknown";
  }
}
