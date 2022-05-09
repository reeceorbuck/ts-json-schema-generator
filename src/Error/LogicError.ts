import { BaseError } from "./BaseError.ts";

export class LogicError extends BaseError {
  public constructor(private msg: string) {
    super(msg);
  }
}
