import type { ClickUpConfig } from "../types/config.types";
import type { Response } from "../interfaces";

type Body = Record<string, unknown> | FormData;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Body;
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
};

export abstract class Base {
  protected config: ClickUpConfig;

  constructor(config: ClickUpConfig) {
    this.config = config;
  }

  /**
   * Constructs a full URL for the ClickUp API by combining the base URL,
   * endpoint path, and optional query parameters.
   *
   * @param endpoint - The API endpoint path (with or without leading slash)
   * @param query - Optional query parameters to append to the URL
   * @returns The complete URL string
   */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ClickUp complex url structure does not allow for low complexity
  private buildUrl(endpoint: string, query?: Record<string, unknown>): string {
    const baseUrl = "https://api.clickup.com/api/v2";
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    const url = `${baseUrl}${normalizedEndpoint}`;

    if (!query || Object.keys(query).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) {
        continue;
      }

      // Handle array parameters with bracket notation
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== undefined && item !== null) {
            searchParams.append(`${key}[]`, String(item));
          }
        }
        continue;
      }

      // Handle nested objects (stringify JSON)
      if (typeof value === "object") {
        searchParams.set(key, JSON.stringify(value));
        continue;
      }

      // Handle primitives
      searchParams.set(key, String(value));
    }

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Builds request headers by merging authorization, content-type, config headers,
   * and request-specific headers with proper priority.
   *
   * @param body - The body of the request for content type handling
   * @param requestHeaders - Optional request-specific headers to merge
   * @returns Record of header key-value pairs with all values as strings
   */
  private buildHeaders(
    body: unknown,
    requestHeaders?: Record<string, string>,
  ): Record<string, string> {
    const headers: Record<string, string> = {};

    // 1. Start with Authorization header
    headers.Authorization = `${this.config.apiToken}`;

    // 2. Add Content-Type when body is present
    const isFormData =
      typeof body === "object" &&
      body !== null &&
      typeof (body as FormData).append === "function" &&
      body.constructor?.name === "FormData";

    if (body && !isFormData) {
      headers["Content-Type"] = "application/json";
    }

    // 3. Merge config.headers if provided
    if (this.config.headers) {
      for (const [key, value] of Object.entries(this.config.headers)) {
        // Don't override Authorization header from config
        if (key !== "Authorization" && value !== undefined && value !== null) {
          headers[key] = String(value);
        }
      }
    }

    // 4. Merge request-specific headers from options
    if (requestHeaders) {
      for (const [key, value] of Object.entries(requestHeaders)) {
        // Don't override Authorization header from request options
        if (key !== "Authorization" && value !== undefined && value !== null) {
          headers[key] = String(value);
        }
      }
    }

    return headers;
  }

  /**
   * Prepares the request body for HTTP methods that support it.
   * Serializes the body to JSON for POST, PUT, and PATCH requests.
   * Returns undefined for GET and DELETE requests, ignoring any provided body.
   *
   * @param method - The HTTP method for the request
   * @param body - Optional body data to serialize
   * @returns JSON string for methods that accept body, undefined otherwise
   */
  private prepareRequestBody(
    method: string,
    body?: Body,
  ): string | FormData | undefined {
    // GET and DELETE requests should not have a body
    if (method === "GET" || method === "DELETE") {
      return undefined;
    }

    if (body instanceof FormData) {
      return body; // IMPORTANT: do NOT stringify
    }

    // POST, PUT, and PATCH requests serialize body to JSON
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      return JSON.stringify(body);
    }

    return undefined;
  }

  /**
   * Extracts error message from HTTP response.
   * @private
   */
  private async extractErrorMessage(
    response: globalThis.Response,
    defaultMessage: string,
  ): Promise<string> {
    try {
      const errorData = await response.json();
      if (
        typeof errorData === "object" &&
        errorData !== null &&
        ("message" in errorData || "err" in errorData)
      ) {
        return (
          (errorData as { message?: string }).message ||
          (errorData as { err?: string }).err ||
          defaultMessage
        );
      }
      return defaultMessage;
    } catch {
      return defaultMessage;
    }
  }

  /**
   * Handles HTTP error responses (non-2xx status codes).
   * @private
   */
  private async handleHttpError<T>(
    response: globalThis.Response,
  ): Promise<Response<T>> {
    if (response.status === 401) {
      const errorMessage = await this.extractErrorMessage(
        response,
        "Unauthorized",
      );
      return {
        error: {
          message: errorMessage,
          statusCode: 401,
          name: "unauthorized",
        },
        data: null,
      };
    }

    const errorMessage = await this.extractErrorMessage(
      response,
      response.statusText || "Request failed",
    );
    return {
      error: {
        message: errorMessage,
        statusCode: response.status,
        name: "unknow_error",
      },
      data: null,
    };
  }

  /**
   * Parses successful HTTP response body.
   * @private
   */
  private async parseSuccessResponse<T>(
    response: globalThis.Response,
  ): Promise<Response<T>> {
    try {
      const text = await response.text();
      if (!text || text.trim() === "") {
        return {
          data: {} as T,
          error: null,
        };
      }

      const data = JSON.parse(text) as T;
      return {
        data,
        error: null,
      };
    } catch {
      return {
        error: {
          message: "Invalid JSON response",
          statusCode: null,
          name: "unknow_error",
        },
        data: null,
      };
    }
  }

  /**
   * Makes an authenticated HTTP request to the ClickUp API.
   *
   * This protected method provides a reusable interface for all API method
   * implementations, handling authentication, URL construction, header
   * management, and error handling automatically.
   *
   * **Features:**
   * - Automatic authentication with Bearer token from config
   * - Base URL prepending (https://api.clickup.com/api/v2)
   * - URL normalization (handles endpoints with or without leading slash)
   * - Query parameter encoding for GET requests
   * - Request body serialization for POST/PUT/PATCH (ignored for GET/DELETE)
   * - Header merging with proper priority (auth > config > request-specific)
   * - Content-Type is automatically added when body is JSON (not FormData)
   * - Consistent error handling with structured error responses
   * - JSON response parsing with empty body handling
   *
   * @template T - The expected response data type
   *
   * @param endpoint - The API endpoint path (e.g., "/task" or "task").
   *                   Leading slash is optional and will be normalized.
   *
   * @param options - Optional request configuration
   * @param options.method - HTTP method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
   *                         (default: "GET")
   * @param options.body - Request body object for POST/PUT/PATCH requests.
   *                       Automatically serialized to JSON. Ignored for GET/DELETE.
   * @param options.query - Query parameters to append to URL. Values are
   *                        automatically encoded. Null/undefined values are omitted.
   * @param options.headers - Additional headers to merge with default headers.
   *                          Cannot override Authorization header.
   *
   * @returns Promise resolving to Response<T> union type:
   *          - Success: `{ data: T, error: null }`
   *          - Error: `{ data: null, error: ErrorResponse }`
   *
   * **Error Cases:**
   *
   * The method returns structured errors (never throws) for:
   *
   * 1. **Missing API Token** (unauthorized)
   *    - Returned when config.apiToken is not set
   *    - statusCode: null
   *    - message: "API token is required"
   *
   * 2. **401 Unauthorized** (unauthorized)
   *    - Returned when API rejects authentication
   *    - statusCode: 401
   *    - message: Extracted from API response or "Unauthorized"
   *
   * 3. **HTTP Errors** (unknow_error)
   *    - Returned for any non-2xx status code (except 401)
   *    - statusCode: HTTP status code from response
   *    - message: Extracted from API response or status text
   *
   * 4. **Network Errors** (unknow_error)
   *    - Returned when fetch fails (connection, timeout, DNS, etc.)
   *    - statusCode: null
   *    - message: Error message from exception
   *
   * 5. **Invalid JSON** (unknow_error)
   *    - Returned when response body is not valid JSON
   *    - statusCode: null
   *    - message: "Invalid JSON response"
   *
   * @example
   * ```typescript
   * // GET request with query parameters
   * const result = await this.request<Task[]>("/task", {
   *   query: { archived: false, page: 1 }
   * });
   * if (result.error) {
   *   console.error(result.error.message);
   * } else {
   *   console.log(result.data); // Task[]
   * }
   *
   * // POST request with body
   * const result = await this.request<Task>("/task", {
   *   method: "POST",
   *   body: { name: "New Task", description: "Task details" }
   * });
   *
   * // PUT request with custom headers
   * const result = await this.request<Task>("/task/123", {
   *   method: "PUT",
   *   body: { status: "completed" },
   *   headers: { "X-Request-ID": "abc123" }
   * });
   *
   * // DELETE request
   * const result = await this.request<void>("/task/123", {
   *   method: "DELETE"
   * });
   *
   * // PATCH request for partial update
   * const result = await this.request<Task>("/task/123", {
   *   method: "PATCH",
   *   body: { priority: 3 }
   * });
   * ```
   */
  protected async request<T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<Response<T>> {
    // 1. Validate API token is present
    if (!this.config.apiToken) {
      return {
        error: {
          message: "API token is required",
          statusCode: null,
          name: "unauthorized",
        },
        data: null,
      };
    }

    // 2. Extract options with defaults
    const method = options?.method || "GET";
    const { body, query, headers: requestHeaders } = options || {};

    // 3. Build full URL with query parameters
    const url = this.buildUrl(endpoint, query);

    // 4. Prepare request body if applicable
    const requestBody = this.prepareRequestBody(method, body);

    // 5. Build headers with authentication
    const headers = this.buildHeaders(requestBody, requestHeaders);

    try {
      // 6. Execute fetch with constructed parameters
      const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
      });

      // 7. Handle HTTP errors or parse success response
      if (!response.ok) {
        return this.handleHttpError<T>(response);
      }

      return this.parseSuccessResponse<T>(response);
    } catch (error) {
      // Network errors or other exceptions
      const errorMessage =
        error instanceof Error ? error.message : "Network request failed";

      return {
        error: {
          message: errorMessage,
          statusCode: null,
          name: "unknow_error",
        },
        data: null,
      };
    }
  }
}
