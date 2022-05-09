import { BaseType } from "../Type/BaseType.ts";
import { BaseError } from "./BaseError.ts";

export class UnknownTypeError extends BaseError {
  public constructor(private type: BaseType | undefined) {
    super(`Unknown type "${type ? type.getId() : undefined}"`);
  }

  public getType(): BaseType | undefined {
    return this.type;
  }
}
