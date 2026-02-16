export type ClickUpConfig = {
  /**
   * The api token for your clickup account
   * @description You can generate a personal token or use OAuth
   * @see https://developer.clickup.com/docs/authentication
   */
  apiToken: string;
  /**
   * Additional headers to pass with each request
   * @description Useful for adding tags with Next.js for example
   */
  headers?: Record<string, unknown>;
};
