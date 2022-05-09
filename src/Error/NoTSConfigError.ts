import { BaseError } from "./BaseError.ts";

export class NoTSConfigError extends BaseError {
  public get name(): string {
    return "NoTSConfigError";
  }
  public get message(): string {
    return `No tsconfig file found`;
  }
}
