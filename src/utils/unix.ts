/**
 * Converts a Date to a Unix timestamp in milliseconds,
 * as expected by the ClickUp API.
 */
export const toUnixMillis = (date: Date): number => {
  return date.getTime();
};

/**
 * Converts a ClickUp Unix timestamp (milliseconds) back to a Date.
 */
export const fromUnixMillis = (timestamp: number): Date => {
  return new Date(timestamp);
};
