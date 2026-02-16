import { describe, expect, it } from "vitest";
import { Authorization } from "./authorization.js";
import type { ClickUpConfig } from "../../types/config.types.js";

describe("Authorization - getAccessToken", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const authorization = new Authorization(config);

  it("should construct correct endpoint", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ access_token: "token_abc" }),
      } as Response;
    };

    await authorization.getAccessToken({
      client_id: "client_123",
      client_secret: "secret_456",
      code: "code_789",
    });

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/oauth/token");
  });

  it("should use POST HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (
      _url: string | URL | Request,
      options?: RequestInit,
    ) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ access_token: "token_abc" }),
      } as Response;
    };

    await authorization.getAccessToken({
      client_id: "client_123",
      client_secret: "secret_456",
      code: "code_789",
    });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with params", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: string | URL | Request,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ access_token: "token_abc" }),
      } as Response;
    };

    const params = {
      client_id: "client_123",
      client_secret: "secret_456",
      code: "code_789",
    };

    await authorization.getAccessToken(params);

    const parsedBody = JSON.parse(capturedBody);
    expect(parsedBody.params).toEqual(params);
  });

  it("should handle successful response", async () => {
    const mockData = { access_token: "token_abc123" };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await authorization.getAccessToken({
      client_id: "client_123",
      client_secret: "secret_456",
      code: "code_789",
    });

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({ message: "Invalid credentials" }),
      }) as Response;

    const result = await authorization.getAccessToken({
      client_id: "invalid_client",
      client_secret: "invalid_secret",
      code: "invalid_code",
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(401);
  });
});

describe("Authorization - getAuthorizedUser", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const authorization = new Authorization(config);

  it("should construct correct endpoint", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            user: {
              id: 123,
              username: "testuser",
              email: "test@example.com",
              color: "#ff0000",
              profilePicture: null,
              initials: "TU",
              week_start_day: 0,
              global_font_support: true,
              timezone: "America/New_York",
            },
          }),
      } as Response;
    };

    await authorization.getAuthorizedUser();

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/user");
  });

  it("should use GET HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (
      _url: string | URL | Request,
      options?: RequestInit,
    ) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            user: {
              id: 123,
              username: "testuser",
              email: "test@example.com",
              color: "#ff0000",
              profilePicture: null,
              initials: "TU",
              week_start_day: 0,
              global_font_support: true,
              timezone: "America/New_York",
            },
          }),
      } as Response;
    };

    await authorization.getAuthorizedUser();

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      user: {
        id: 123,
        username: "testuser",
        email: "test@example.com",
        color: "#ff0000",
        profilePicture: null,
        initials: "TU",
        week_start_day: 0,
        global_font_support: true,
        timezone: "America/New_York",
      },
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await authorization.getAuthorizedUser();

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ message: "Invalid token" }),
      }) as Response;

    const result = await authorization.getAuthorizedUser();

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});
