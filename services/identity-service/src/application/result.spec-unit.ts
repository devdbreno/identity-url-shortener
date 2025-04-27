import { Result } from './result';
import { AppError } from './error-types';

describe('Result', () => {
  it('should create a successful result with a value', () => {
    const value = { id: 1, name: 'Test' };
    const result = Result.ok(value);

    expect(result.value).toEqual(value);
    expect(result.error).toBeUndefined();
    expect(result.isSuccess).toBe(true);
  });

  it('should create a failed result with an error', () => {
    const error: AppError = {
      status: 500,
      message: 'An error occurred',
    };

    const result = Result.fail(error);

    expect(result.value).toBeUndefined();
    expect(result.error).toStrictEqual(error);
    expect(result.isSuccess).toBe(false);
  });
});
