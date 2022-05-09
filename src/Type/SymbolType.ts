import { PrimitiveType } from "./PrimitiveType.ts";

export class SymbolType extends PrimitiveType {
  public getId(): string {
    return "symbol";
  }
}
