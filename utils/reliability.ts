/**
 * Reliability Engineering Utility
 * Provides deterministic retry logic for critical async operations.
 */

export async function retryAsync<T>(
  fn: () => Promise<T>,
  retries: number = 1,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries) {
        console.warn(`[Reliability] Operation failed, retrying (${i + 1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError;
}
