import { describe, expect, it } from "vitest";
import { Spaces } from "./spaces.js";
import type { ClickUpConfig } from "../../types/config.types.js";

describe("Spaces - getSpaces", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const spaces = new Spaces(config);

  it("should construct correct endpoint with team_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ spaces: [] }),
      } as Response;
    };

    await spaces.getSpaces("team_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/team/team_123/space",
    );
  });

  it("should use GET HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ spaces: [] }),
      } as Response;
    };

    await spaces.getSpaces("team_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should include archived param in query string when provided", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ spaces: [] }),
      } as Response;
    };

    await spaces.getSpaces("team_123", { archived: true });

    expect(capturedUrl).toContain("archived=true");
  });

  it("should handle successful response", async () => {
    const mockData = {
      spaces: [
        {
          id: "space_123",
          name: "Test Space",
          private: false,
          statuses: [],
          multiple_assignees: true,
          features: {},
          archived: false,
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await spaces.getSpaces("team_123");

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Team not found" }),
      }) as Response;

    const result = await spaces.getSpaces("team_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Spaces - getSpace", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const spaces = new Spaces(config);

  it("should construct correct endpoint with space_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "space_123" }),
      } as Response;
    };

    await spaces.getSpace("space_123");

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/space/space_123");
  });

  it("should use GET HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "space_123" }),
      } as Response;
    };

    await spaces.getSpace("space_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "space_123",
      name: "Test Space",
      private: false,
      statuses: [
        {
          id: "status_1",
          status: "to do",
          type: "open",
          orderindex: 0,
          color: "#d3d3d3",
        },
      ],
      multiple_assignees: true,
      features: {},
      archived: false,
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await spaces.getSpace("space_123");

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Space not found" }),
      }) as Response;

    const result = await spaces.getSpace("space_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Spaces - createSpace", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const spaces = new Spaces(config);

  it("should construct correct endpoint with team_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "space_123" }),
      } as Response;
    };

    await spaces.createSpace("team_123", { name: "New Space" });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/team/team_123/space",
    );
  });

  it("should use POST HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "space_123" }),
      } as Response;
    };

    await spaces.createSpace("team_123", { name: "New Space" });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with space name", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "space_123" }),
      } as Response;
    };

    await spaces.createSpace("team_123", { name: "New Space" });

    const body = JSON.parse(capturedBody);
    expect(body.name).toBe("New Space");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "space_123",
      name: "New Space",
      private: false,
      statuses: [],
      multiple_assignees: false,
      features: {},
      archived: false,
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await spaces.createSpace("team_123", {
      name: "New Space",
    });

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Invalid space name" }),
      }) as Response;

    const result = await spaces.createSpace("team_123", { name: "" });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(400);
  });
});

describe("Spaces - updateSpace", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const spaces = new Spaces(config);

  it("should construct correct endpoint with space_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "space_123" }),
      } as Response;
    };

    await spaces.updateSpace("space_123", { name: "Updated Space" });

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/space/space_123");
  });

  it("should use PUT HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "space_123" }),
      } as Response;
    };

    await spaces.updateSpace("space_123", { name: "Updated Space" });

    expect(capturedMethod).toBe("PUT");
  });

  it("should include request body with updated space name", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "space_123" }),
      } as Response;
    };

    await spaces.updateSpace("space_123", { name: "Updated Space" });

    const body = JSON.parse(capturedBody);
    expect(body.name).toBe("Updated Space");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "space_123",
      name: "Updated Space",
      private: false,
      statuses: [],
      multiple_assignees: true,
      features: {},
      archived: false,
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await spaces.updateSpace("space_123", {
      name: "Updated Space",
    });

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Space not found" }),
      }) as Response;

    const result = await spaces.updateSpace("space_999", {
      name: "Updated Space",
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Spaces - deleteSpace", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const spaces = new Spaces(config);

  it("should construct correct endpoint with space_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await spaces.deleteSpace("space_123");

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/space/space_123");
  });

  it("should use DELETE HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await spaces.deleteSpace("space_123");

    expect(capturedMethod).toBe("DELETE");
  });

  it("should not include request body", async () => {
    let capturedBody: string | undefined;
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string | undefined;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await spaces.deleteSpace("space_123");

    expect(capturedBody).toBeUndefined();
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await spaces.deleteSpace("space_123");

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ message: "Cannot delete space" }),
      }) as Response;

    const result = await spaces.deleteSpace("space_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});
