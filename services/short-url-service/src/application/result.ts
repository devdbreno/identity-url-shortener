import { AppError } from './error-types';

export class Result<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value?: T,
    public readonly error?: AppError,
  ) {}

  public static ok<T>(value: T): Result<T> {
    return new Result<T>(true, value);
  }

  public static fail<T>(error: AppError): Result<T> {
    return new Result<T>(false, undefined, error);
  }
}
