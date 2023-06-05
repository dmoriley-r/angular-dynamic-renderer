/**
 * Type guard for PromiseRejectedResult that checks for status of 'rejected';
 * @param input a result from preforming Promise.allSettled()
 * @returns Promise rejected result type
 */
export const isRejected = (
  input: PromiseSettledResult<unknown>
): input is PromiseRejectedResult => input.status === 'rejected';

/**
 * Type guard for PromiseRejectedResult that checks for status of 'fulfilled';
 * @param input a result from preforming Promise.allSettled()
 * @returns Promise fulfilled result type
 */
export const isFulfilled = <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';
