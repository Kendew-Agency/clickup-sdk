import { describe, expect, it } from "vitest";
import { Base } from "./base.js";
import type { ClickUpConfig } from "../types/config.types.js";

// Test harness class to expose private methods for testing
class TestBase extends Base {
  // Expose buildUrl for testing
  public testBuildUrl(
    endpoint: string,
    query?: Record<string, unknown>,
  ): string {
    // biome-ignore lint/suspicious/noExplicitAny: Accessing private method for testing
    return (this as any).buildUrl(endpoint, query);
  }

  // Expose buildHeaders for testing
  public testBuildHeaders(
    hasBody: boolean,
    requestHeaders?: Record<string, string>,
  ): Record<string, string> {
    // biome-ignore lint/suspicious/noExplicitAny: Accessing private method for testing
    return (this as any).buildHeaders(hasBody, requestHeaders);
  }

  // Expose prepareRequestBody for testing
  public testPrepareRequestBody(
    method: string,
    body?: Record<string, unknown>,
  ): string | undefined {
    // biome-ignore lint/suspicious/noExplicitAny: Accessing private method for testing
    return (this as any).prepareRequestBody(method, body);
  }
}

describe("Base class - URL construction", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const testBase = new TestBase(config);

  describe("buildUrl", () => {
    it("should prepend base URL to endpoint", () => {
      const url = testBase.testBuildUrl("/tasks");
      expect(url).toBe("https://api.clickup.com/api/v2/tasks");
    });

    it("should handle endpoint without leading slash", () => {
      const url = testBase.testBuildUrl("tasks");
      expect(url).toBe("https://api.clickup.com/api/v2/tasks");
    });

    it("should handle endpoint with leading slash", () => {
      const url = testBase.testBuildUrl("/spaces/123");
      expect(url).toBe("https://api.clickup.com/api/v2/spaces/123");
    });

    it("should append query parameters", () => {
      const url = testBase.testBuildUrl("/tasks", { archived: false, page: 1 });
      expect(url).toContain("https://api.clickup.com/api/v2/tasks?");
      expect(url).toContain("archived=false");
      expect(url).toContain("page=1");
    });

    it("should handle empty query parameters", () => {
      const url = testBase.testBuildUrl("/tasks", {});
      expect(url).toBe("https://api.clickup.com/api/v2/tasks");
    });

    it("should handle undefined query parameters", () => {
      const url = testBase.testBuildUrl("/tasks", undefined);
      expect(url).toBe("https://api.clickup.com/api/v2/tasks");
    });

    it("should encode special characters in query parameters", () => {
      const url = testBase.testBuildUrl("/tasks", { name: "test task" });
      expect(url).toBe("https://api.clickup.com/api/v2/tasks?name=test+task");
    });

    it("should skip null and undefined query parameter values", () => {
      const url = testBase.testBuildUrl("/tasks", {
        name: "test",
        archived: null,
        status: undefined,
      });
      expect(url).toBe("https://api.clickup.com/api/v2/tasks?name=test");
    });

    it("should convert query parameter values to strings", () => {
      const url = testBase.testBuildUrl("/tasks", {
        page: 1,
        archived: false,
        limit: 50,
      });
      expect(url).toContain("page=1");
      expect(url).toContain("archived=false");
      expect(url).toContain("limit=50");
    });
  });
});

describe("Base class - Header construction", () => {
  describe("buildHeaders", () => {
    it("should include Authorization header token", () => {
      const config: ClickUpConfig = { apiToken: "test_token_123" };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(false);

      expect(headers.Authorization).toBe("test_token_123");
    });

    it("should include Content-Type when body is present", () => {
      const config: ClickUpConfig = { apiToken: "test_token_123" };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(true);

      expect(headers["Content-Type"]).toBe("application/json");
    });

    it("should not include Content-Type when body is absent", () => {
      const config: ClickUpConfig = { apiToken: "test_token_123" };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(false);

      expect(headers["Content-Type"]).toBeUndefined();
    });

    it("should merge custom headers from config", () => {
      const config: ClickUpConfig = {
        apiToken: "test_token_123",
        headers: {
          "X-Custom-Header": "custom-value",
          "X-Another-Header": "another-value",
        },
      };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(false);

      expect(headers["X-Custom-Header"]).toBe("custom-value");
      expect(headers["X-Another-Header"]).toBe("another-value");
    });

    it("should merge request-specific headers", () => {
      const config: ClickUpConfig = { apiToken: "test_token_123" };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(false, {
        "X-Request-Header": "request-value",
      });

      expect(headers["X-Request-Header"]).toBe("request-value");
    });

    it("should preserve Authorization header when custom headers are provided", () => {
      const config: ClickUpConfig = {
        apiToken: "test_token_123",
        headers: {
          "X-Custom-Header": "custom-value",
        },
      };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(false);

      expect(headers.Authorization).toBe("test_token_123");
      expect(headers["X-Custom-Header"]).toBe("custom-value");
    });

    it("should not allow config headers to override Authorization", () => {
      const config: ClickUpConfig = {
        apiToken: "test_token_123",
        headers: {
          // biome-ignore lint/style/useNamingConvention: Testing Authorization header override protection
          Authorization: "malicious_token",
        },
      };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(false);

      expect(headers.Authorization).toBe("test_token_123");
    });

    it("should not allow request headers to override Authorization", () => {
      const config: ClickUpConfig = { apiToken: "test_token_123" };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(false, {
        // biome-ignore lint/style/useNamingConvention: Testing Authorization header override protection
        Authorization: "malicious_token",
      });

      expect(headers.Authorization).toBe("test_token_123");
    });

    it("should prioritize request headers over config headers", () => {
      const config: ClickUpConfig = {
        apiToken: "test_token_123",
        headers: {
          "X-Custom-Header": "config-value",
        },
      };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(false, {
        "X-Custom-Header": "request-value",
      });

      expect(headers["X-Custom-Header"]).toBe("request-value");
    });

    it("should convert header values to strings", () => {
      const config: ClickUpConfig = {
        apiToken: "test_token_123",
        headers: {
          // biome-ignore lint/suspicious/noExplicitAny: Testing type conversion
          "X-Number-Header": 123 as any,
          // biome-ignore lint/suspicious/noExplicitAny: Testing type conversion
          "X-Boolean-Header": true as any,
        },
      };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(false);

      expect(headers["X-Number-Header"]).toBe("123");
      expect(headers["X-Boolean-Header"]).toBe("true");
    });

    it("should skip null and undefined header values from config", () => {
      const config: ClickUpConfig = {
        apiToken: "test_token_123",
        headers: {
          "X-Valid-Header": "valid",
          // biome-ignore lint/suspicious/noExplicitAny: Testing null/undefined handling
          "X-Null-Header": null as any,
          // biome-ignore lint/suspicious/noExplicitAny: Testing null/undefined handling
          "X-Undefined-Header": undefined as any,
        },
      };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(false);

      expect(headers["X-Valid-Header"]).toBe("valid");
      expect(headers["X-Null-Header"]).toBeUndefined();
      expect(headers["X-Undefined-Header"]).toBeUndefined();
    });

    it("should skip null and undefined header values from request", () => {
      const config: ClickUpConfig = { apiToken: "test_token_123" };
      const testBase = new TestBase(config);
      const headers = testBase.testBuildHeaders(false, {
        "X-Valid-Header": "valid",
        // biome-ignore lint/suspicious/noExplicitAny: Testing null/undefined handling
        "X-Null-Header": null as any,
        // biome-ignore lint/suspicious/noExplicitAny: Testing null/undefined handling
        "X-Undefined-Header": undefined as any,
      });

      expect(headers["X-Valid-Header"]).toBe("valid");
      expect(headers["X-Null-Header"]).toBeUndefined();
      expect(headers["X-Undefined-Header"]).toBeUndefined();
    });
  });
});

describe("Base class - Response parsing", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };

  it("should parse successful JSON response", async () => {
    const testBase = new TestBase(config);
    const mockData = { id: "123", name: "Test Task" };

    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle empty response body gracefully", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 204,
        text: async () => "",
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle whitespace-only response body", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => "   ",
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should preserve nested JSON structure", async () => {
    const testBase = new TestBase(config);
    const mockData = {
      task: {
        id: "123",
        name: "Test Task",
        assignees: [{ id: "user1" }, { id: "user2" }],
        tags: ["urgent", "bug"],
      },
    };

    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toEqual(mockData);
    expect(result.data?.task.assignees).toHaveLength(2);
    expect(result.data?.task.tags).toEqual(["urgent", "bug"]);
    expect(result.error).toBeNull();
  });

  it("should handle arrays in response", async () => {
    const testBase = new TestBase(config);
    const mockData = [
      { id: "1", name: "Task 1" },
      { id: "2", name: "Task 2" },
    ];

    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toEqual(mockData);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.error).toBeNull();
  });

  it("should return error for invalid JSON response", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => "invalid json {",
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.message).toBe("Invalid JSON response");
    expect(result.error?.name).toBe("unknow_error");
  });
});

describe("Base class - Error handling", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };

  it("should return unauthorized error when API token is missing", async () => {
    const testBase = new TestBase({ apiToken: "" });

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.name).toBe("unauthorized");
    expect(result.error?.message).toBe("API token is required");
    expect(result.error?.statusCode).toBeNull();
  });

  it("should return unauthorized error for 401 response", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({ message: "Invalid API token" }),
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.name).toBe("unauthorized");
    expect(result.error?.message).toBe("Invalid API token");
    expect(result.error?.statusCode).toBe(401);
  });

  it("should use default message for 401 when response has no message", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({}),
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.name).toBe("unauthorized");
    expect(result.error?.message).toBe("Unauthorized");
    expect(result.error?.statusCode).toBe(401);
  });

  it("should return unknow_error for 404 response", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Resource not found" }),
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks/999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.name).toBe("unknow_error");
    expect(result.error?.message).toBe("Resource not found");
    expect(result.error?.statusCode).toBe(404);
  });

  it("should return unknow_error for 500 response", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Server error occurred" }),
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.name).toBe("unknow_error");
    expect(result.error?.message).toBe("Server error occurred");
    expect(result.error?.statusCode).toBe(500);
  });

  it("should use statusText when error response has no message", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({}),
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.name).toBe("unknow_error");
    expect(result.error?.message).toBe("Forbidden");
    expect(result.error?.statusCode).toBe(403);
  });

  it("should handle error response with err field", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ err: "Invalid request parameters" }),
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.name).toBe("unknow_error");
    expect(result.error?.message).toBe("Invalid request parameters");
    expect(result.error?.statusCode).toBe(400);
  });

  it("should handle error response with non-JSON body", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () =>
      //@ts-expect-error Testing error
      ({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
        json: async () => {
          throw new Error("Not JSON");
        },
      }) as Response;

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.name).toBe("unknow_error");
    expect(result.error?.message).toBe("Service Unavailable");
    expect(result.error?.statusCode).toBe(503);
  });

  it("should handle network errors", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () => {
      throw new Error("Network connection failed");
    };

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.name).toBe("unknow_error");
    expect(result.error?.message).toBe("Network connection failed");
    expect(result.error?.statusCode).toBeNull();
  });

  it("should handle non-Error exceptions", async () => {
    const testBase = new TestBase(config);

    globalThis.fetch = async () => {
      throw "String error";
    };

    // biome-ignore lint/suspicious/noExplicitAny: Accessing protected method for testing
    const result = await (testBase as any).request("/tasks");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.name).toBe("unknow_error");
    expect(result.error?.message).toBe("Network request failed");
    expect(result.error?.statusCode).toBeNull();
  });
});

describe("Base class - Request body handling", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const testBase = new TestBase(config);

  describe("prepareRequestBody", () => {
    it("should serialize body to JSON for POST requests", () => {
      const body = { name: "New Task", description: "Task description" };
      const result = testBase.testPrepareRequestBody("POST", body);

      expect(result).toBe(JSON.stringify(body));
      expect(result).toBe(
        '{"name":"New Task","description":"Task description"}',
      );
    });

    it("should serialize body to JSON for PUT requests", () => {
      const body = { name: "Updated Task", status: "completed" };
      const result = testBase.testPrepareRequestBody("PUT", body);

      expect(result).toBe(JSON.stringify(body));
      expect(result).toBe('{"name":"Updated Task","status":"completed"}');
    });

    it("should serialize body to JSON for PATCH requests", () => {
      const body = { status: "in progress" };
      const result = testBase.testPrepareRequestBody("PATCH", body);

      expect(result).toBe(JSON.stringify(body));
      expect(result).toBe('{"status":"in progress"}');
    });

    it("should return undefined for GET requests even with body provided", () => {
      const body = { name: "Task" };
      const result = testBase.testPrepareRequestBody("GET", body);

      expect(result).toBeUndefined();
    });

    it("should return undefined for DELETE requests even with body provided", () => {
      const body = { id: "123" };
      const result = testBase.testPrepareRequestBody("DELETE", body);

      expect(result).toBeUndefined();
    });

    it("should return undefined for POST requests without body", () => {
      const result = testBase.testPrepareRequestBody("POST");

      expect(result).toBeUndefined();
    });

    it("should return undefined for PUT requests without body", () => {
      const result = testBase.testPrepareRequestBody("PUT");

      expect(result).toBeUndefined();
    });

    it("should return undefined for PATCH requests without body", () => {
      const result = testBase.testPrepareRequestBody("PATCH");

      expect(result).toBeUndefined();
    });

    it("should handle nested objects in body", () => {
      const body = {
        task: {
          name: "Nested Task",
          assignees: [{ id: "123" }, { id: "456" }],
        },
      };
      const result = testBase.testPrepareRequestBody("POST", body);

      expect(result).toBe(JSON.stringify(body));
      const parsed = JSON.parse(result as string);
      expect(parsed.task.name).toBe("Nested Task");
      expect(parsed.task.assignees).toHaveLength(2);
    });

    it("should handle arrays in body", () => {
      const body = {
        tags: ["urgent", "bug", "frontend"],
        priorities: [1, 2, 3],
      };
      const result = testBase.testPrepareRequestBody("POST", body);

      expect(result).toBe(JSON.stringify(body));
      const parsed = JSON.parse(result as string);
      expect(parsed.tags).toEqual(["urgent", "bug", "frontend"]);
      expect(parsed.priorities).toEqual([1, 2, 3]);
    });

    it("should handle empty object body", () => {
      const body = {};
      const result = testBase.testPrepareRequestBody("POST", body);

      expect(result).toBe("{}");
    });

    it("should handle body with null values", () => {
      const body = { name: "Task", description: null };
      const result = testBase.testPrepareRequestBody("POST", body);

      expect(result).toBe(JSON.stringify(body));
      expect(result).toBe('{"name":"Task","description":null}');
    });

    it("should handle body with various data types", () => {
      const body = {
        string: "text",
        number: 42,
        boolean: true,
        nullValue: null,
        array: [1, 2, 3],
        object: { nested: "value" },
      };
      const result = testBase.testPrepareRequestBody("POST", body);

      expect(result).toBe(JSON.stringify(body));
      const parsed = JSON.parse(result as string);
      expect(parsed.string).toBe("text");
      expect(parsed.number).toBe(42);
      expect(parsed.boolean).toBe(true);
      expect(parsed.nullValue).toBeNull();
      expect(parsed.array).toEqual([1, 2, 3]);
      expect(parsed.object.nested).toBe("value");
    });
  });
});
