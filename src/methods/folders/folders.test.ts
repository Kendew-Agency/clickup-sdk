import { describe, expect, it } from "vitest";
import { Folders } from "./folders.js";
import type { ClickUpConfig } from "../../types/config.types.js";

describe("Folders - getFolders", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const folders = new Folders(config);

  it("should construct correct endpoint with space_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ folders: [] }),
      } as Response;
    };

    await folders.getFolders("space_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/space/space_123/folder",
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
        text: async () => JSON.stringify({ folders: [] }),
      } as Response;
    };

    await folders.getFolders("space_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should include archived param in query string when provided", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ folders: [] }),
      } as Response;
    };

    await folders.getFolders("space_123", { archived: true });

    expect(capturedUrl).toContain("archived=true");
  });

  it("should handle successful response", async () => {
    const mockData = {
      folders: [
        {
          id: "folder_123",
          name: "Test Folder",
          orderindex: 0,
          override_statuses: false,
          hidden: false,
          space: { id: "space_123", name: "Test Space" },
          task_count: 5,
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

    const result = await folders.getFolders("space_123");

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

    const result = await folders.getFolders("space_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Folders - getFolder", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const folders = new Folders(config);

  it("should construct correct endpoint with folder_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "folder_123" }),
      } as Response;
    };

    await folders.getFolder("folder_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/folder/folder_123",
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
        text: async () => JSON.stringify({ id: "folder_123" }),
      } as Response;
    };

    await folders.getFolder("folder_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "folder_123",
      name: "Test Folder",
      orderindex: 0,
      override_statuses: false,
      hidden: false,
      space: { id: "space_123", name: "Test Space" },
      task_count: 5,
      archived: false,
      lists: [],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await folders.getFolder("folder_123");

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Folder not found" }),
      }) as Response;

    const result = await folders.getFolder("folder_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Folders - createFolder", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const folders = new Folders(config);

  it("should construct correct endpoint with space_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "folder_123" }),
      } as Response;
    };

    await folders.createFolder("space_123", { name: "New Folder" });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/space/space_123/folder",
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
        text: async () => JSON.stringify({ id: "folder_123" }),
      } as Response;
    };

    await folders.createFolder("space_123", { name: "New Folder" });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with folder name", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "folder_123" }),
      } as Response;
    };

    await folders.createFolder("space_123", { name: "New Folder" });

    const body = JSON.parse(capturedBody);
    expect(body.name).toBe("New Folder");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "folder_123",
      name: "New Folder",
      orderindex: 0,
      override_statuses: false,
      hidden: false,
      space: { id: "space_123", name: "Test Space" },
      task_count: 0,
      archived: false,
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await folders.createFolder("space_123", {
      name: "New Folder",
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
        json: async () => ({ message: "Invalid folder name" }),
      }) as Response;

    const result = await folders.createFolder("space_123", { name: "" });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(400);
  });
});

describe("Folders - updateFolder", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const folders = new Folders(config);

  it("should construct correct endpoint with folder_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "folder_123" }),
      } as Response;
    };

    await folders.updateFolder("folder_123", { name: "Updated Folder" });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/folder/folder_123",
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
        text: async () => JSON.stringify({ id: "folder_123" }),
      } as Response;
    };

    await folders.updateFolder("folder_123", { name: "Updated Folder" });

    expect(capturedMethod).toBe("PUT");
  });

  it("should include request body with updated folder name", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "folder_123" }),
      } as Response;
    };

    await folders.updateFolder("folder_123", { name: "Updated Folder" });

    const body = JSON.parse(capturedBody);
    expect(body.name).toBe("Updated Folder");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "folder_123",
      name: "Updated Folder",
      orderindex: 0,
      override_statuses: false,
      hidden: false,
      space: { id: "space_123", name: "Test Space" },
      task_count: 5,
      archived: false,
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await folders.updateFolder("folder_123", {
      name: "Updated Folder",
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
        json: async () => ({ message: "Folder not found" }),
      }) as Response;

    const result = await folders.updateFolder("folder_999", {
      name: "Updated Folder",
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Folders - deleteFolder", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const folders = new Folders(config);

  it("should construct correct endpoint with folder_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await folders.deleteFolder("folder_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/folder/folder_123",
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

    await folders.deleteFolder("folder_123");

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

    await folders.deleteFolder("folder_123");

    expect(capturedBody).toBeUndefined();
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await folders.deleteFolder("folder_123");

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ message: "Cannot delete folder" }),
      }) as Response;

    const result = await folders.deleteFolder("folder_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});
