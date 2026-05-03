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

/**
 * Global Error Safety Wrapper (Async)
 * Ensures that an operation never crashes the application.
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  defaultValue: T,
  context: string = 'global'
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[Reliability] [${context}] Async execution failed, using fallback:`, err);
    return defaultValue;
  }
}

/**
 * Global Error Safety Wrapper (Sync)
 * Ensures that a synchronous operation never crashes the application.
 */
export function safeExecuteSync<T>(
  fn: () => T,
  defaultValue: T,
  context: string = 'global'
): T {
  try {
    return fn();
  } catch (err) {
    console.error(`[Reliability] [${context}] Sync execution failed, using fallback:`, err);
    return defaultValue;
  }
}
