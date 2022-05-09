import { BaseError } from "./BaseError.ts";

export class NoRootTypeError extends BaseError {
  public constructor(private type: string) {
    super(`No root type "${type}" found`);
  }

  public getType(): string {
    return this.type;
  }
}
