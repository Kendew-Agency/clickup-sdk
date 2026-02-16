import { describe, expect, it } from "vitest";
import { Tags } from "./tags.js";
import type { ClickUpConfig } from "../../types/config.types.js";

describe("Tags - getSpaceTags", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tags = new Tags(config);

  it("should construct correct endpoint with space_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ tags: [] }),
      } as Response;
    };

    await tags.getSpaceTags("space_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/space/space_123/tag",
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
        text: async () => JSON.stringify({ tags: [] }),
      } as Response;
    };

    await tags.getSpaceTags("space_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      tags: [
        {
          name: "priority",
          tag_fg: "#FFFFFF",
          tag_bg: "#FF0000",
          creator: 123,
        },
        {
          name: "bug",
          tag_fg: "#000000",
          tag_bg: "#FFFF00",
          creator: 456,
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await tags.getSpaceTags("space_123");

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

    const result = await tags.getSpaceTags("space_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Tags - createSpaceTag", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tags = new Tags(config);

  it("should construct correct endpoint with space_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            name: "new-tag",
            tag_fg: "#FFFFFF",
            tag_bg: "#0000FF",
            creator: 789,
          }),
      } as Response;
    };

    await tags.createSpaceTag("space_123", {
      tag: { name: "new-tag" },
    });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/space/space_123/tag",
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
        text: async () =>
          JSON.stringify({
            name: "new-tag",
            tag_fg: "#FFFFFF",
            tag_bg: "#0000FF",
            creator: 789,
          }),
      } as Response;
    };

    await tags.createSpaceTag("space_123", {
      tag: { name: "new-tag" },
    });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with tag data", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            name: "new-tag",
            tag_fg: "#FFFFFF",
            tag_bg: "#0000FF",
            creator: 789,
          }),
      } as Response;
    };

    await tags.createSpaceTag("space_123", {
      tag: {
        name: "new-tag",
        tag_fg: "#FFFFFF",
        tag_bg: "#0000FF",
      },
    });

    const body = JSON.parse(capturedBody);
    expect(body.tag.name).toBe("new-tag");
    expect(body.tag.tag_fg).toBe("#FFFFFF");
    expect(body.tag.tag_bg).toBe("#0000FF");
  });

  it("should handle successful response", async () => {
    const mockData = {
      name: "new-tag",
      tag_fg: "#FFFFFF",
      tag_bg: "#0000FF",
      creator: 789,
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await tags.createSpaceTag("space_123", {
      tag: { name: "new-tag" },
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
        json: async () => ({ message: "Invalid tag data" }),
      }) as Response;

    const result = await tags.createSpaceTag("space_123", {
      tag: { name: "" },
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(400);
  });
});

describe("Tags - updateSpaceTag", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tags = new Tags(config);

  it("should construct correct endpoint with space_id and tag_name", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            name: "updated-tag",
            tag_fg: "#000000",
            tag_bg: "#00FF00",
            creator: 123,
          }),
      } as Response;
    };

    await tags.updateSpaceTag("space_123", "old-tag", {
      tag: { name: "updated-tag" },
    });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/space/space_123/tag/old-tag",
    );
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
        text: async () =>
          JSON.stringify({
            name: "updated-tag",
            tag_fg: "#000000",
            tag_bg: "#00FF00",
            creator: 123,
          }),
      } as Response;
    };

    await tags.updateSpaceTag("space_123", "old-tag", {
      tag: { name: "updated-tag" },
    });

    expect(capturedMethod).toBe("PUT");
  });

  it("should include request body with updated tag data", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            name: "updated-tag",
            tag_fg: "#000000",
            tag_bg: "#00FF00",
            creator: 123,
          }),
      } as Response;
    };

    await tags.updateSpaceTag("space_123", "old-tag", {
      tag: {
        name: "updated-tag",
        tag_fg: "#000000",
        tag_bg: "#00FF00",
      },
    });

    const body = JSON.parse(capturedBody);
    expect(body.tag.name).toBe("updated-tag");
    expect(body.tag.tag_fg).toBe("#000000");
    expect(body.tag.tag_bg).toBe("#00FF00");
  });

  it("should handle successful response", async () => {
    const mockData = {
      name: "updated-tag",
      tag_fg: "#000000",
      tag_bg: "#00FF00",
      creator: 123,
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await tags.updateSpaceTag("space_123", "old-tag", {
      tag: { name: "updated-tag" },
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
        json: async () => ({ message: "Tag not found" }),
      }) as Response;

    const result = await tags.updateSpaceTag("space_123", "nonexistent-tag", {
      tag: { name: "updated-tag" },
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Tags - deleteSpaceTag", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tags = new Tags(config);

  it("should construct correct endpoint with space_id and tag_name", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tags.deleteSpaceTag("space_123", "tag-to-delete");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/space/space_123/tag/tag-to-delete",
    );
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

    await tags.deleteSpaceTag("space_123", "tag-to-delete");

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

    await tags.deleteSpaceTag("space_123", "tag-to-delete");

    expect(capturedBody).toBeUndefined();
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await tags.deleteSpaceTag("space_123", "tag-to-delete");

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ message: "Cannot delete tag" }),
      }) as Response;

    const result = await tags.deleteSpaceTag("space_123", "protected-tag");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});
