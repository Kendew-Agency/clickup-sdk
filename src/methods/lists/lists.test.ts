import { describe, expect, it } from "vitest";
import { Lists } from "./lists.js";
import type { ClickUpConfig } from "../../types/config.types.js";

describe("Lists - getLists", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const lists = new Lists(config);

  it("should construct correct endpoint with folder_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ lists: [] }),
      } as Response;
    };

    await lists.getLists("folder_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/folder/folder_123/list",
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
        text: async () => JSON.stringify({ lists: [] }),
      } as Response;
    };

    await lists.getLists("folder_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should include archived param in query string when provided", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ lists: [] }),
      } as Response;
    };

    await lists.getLists("folder_123", { archived: true });

    expect(capturedUrl).toContain("archived=true");
  });

  it("should handle successful response", async () => {
    const mockData = {
      lists: [
        {
          id: "list_123",
          name: "Test List",
          orderindex: 0,
          content: "List description",
          status: null,
          priority: null,
          assignee: null,
          task_count: 10,
          due_date: null,
          start_date: null,
          folder: { id: "folder_123", name: "Test Folder" },
          space: { id: "space_123", name: "Test Space" },
          archived: false,
          override_statuses: false,
          permission_level: "create",
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await lists.getLists("folder_123");

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

    const result = await lists.getLists("folder_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Lists - getFolderlessLists", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const lists = new Lists(config);

  it("should construct correct endpoint with space_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ lists: [] }),
      } as Response;
    };

    await lists.getFolderlessLists("space_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/space/space_123/list",
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
        text: async () => JSON.stringify({ lists: [] }),
      } as Response;
    };

    await lists.getFolderlessLists("space_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should include archived param in query string when provided", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ lists: [] }),
      } as Response;
    };

    await lists.getFolderlessLists("space_123", { archived: false });

    expect(capturedUrl).toContain("archived=false");
  });

  it("should handle successful response", async () => {
    const mockData = {
      lists: [
        {
          id: "list_456",
          name: "Folderless List",
          orderindex: 0,
          content: "",
          status: null,
          priority: null,
          assignee: null,
          task_count: 5,
          due_date: null,
          start_date: null,
          folder: { id: "", name: "", hidden: true },
          space: { id: "space_123", name: "Test Space" },
          archived: false,
          override_statuses: false,
          permission_level: "create",
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await lists.getFolderlessLists("space_123");

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ message: "Access denied" }),
      }) as Response;

    const result = await lists.getFolderlessLists("space_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});

describe("Lists - getList", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const lists = new Lists(config);

  it("should construct correct endpoint with list_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "list_123" }),
      } as Response;
    };

    await lists.getList("list_123");

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/list/list_123");
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
        text: async () => JSON.stringify({ id: "list_123" }),
      } as Response;
    };

    await lists.getList("list_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "list_123",
      name: "My List",
      orderindex: 0,
      content: "List content",
      status: { status: "active", color: "#d3d3d3" },
      priority: { priority: "normal", color: "#ffcc00" },
      assignee: null,
      task_count: 15,
      due_date: "1704067200000",
      start_date: null,
      folder: { id: "folder_123", name: "My Folder" },
      space: { id: "space_123", name: "My Space" },
      archived: false,
      override_statuses: true,
      statuses: [],
      permission_level: "create",
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await lists.getList("list_123");

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "List not found" }),
      }) as Response;

    const result = await lists.getList("list_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Lists - createList", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const lists = new Lists(config);

  it("should construct correct endpoint with folder_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "list_new" }),
      } as Response;
    };

    await lists.createList("folder_123", { name: "New List" });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/folder/folder_123/list",
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
        text: async () => JSON.stringify({ id: "list_new" }),
      } as Response;
    };

    await lists.createList("folder_123", { name: "New List" });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with list parameters", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "list_new" }),
      } as Response;
    };

    await lists.createList("folder_123", {
      name: "New List",
      content: "List description",
      priority: 2,
      assignee: 123,
    });

    const body = JSON.parse(capturedBody);
    expect(body.name).toBe("New List");
    expect(body.content).toBe("List description");
    expect(body.priority).toBe(2);
    expect(body.assignee).toBe(123);
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "list_new",
      name: "New List",
      orderindex: 0,
      content: "List description",
      status: null,
      priority: null,
      assignee: null,
      task_count: 0,
      due_date: null,
      start_date: null,
      folder: { id: "folder_123", name: "Test Folder" },
      space: { id: "space_123", name: "Test Space" },
      archived: false,
      override_statuses: false,
      permission_level: "create",
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await lists.createList("folder_123", { name: "New List" });

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Invalid list name" }),
      }) as Response;

    const result = await lists.createList("folder_123", { name: "" });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(400);
  });
});

describe("Lists - createFolderlessList", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const lists = new Lists(config);

  it("should construct correct endpoint with space_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "list_new" }),
      } as Response;
    };

    await lists.createFolderlessList("space_456", { name: "Folderless List" });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/space/space_456/list",
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
        text: async () => JSON.stringify({ id: "list_new" }),
      } as Response;
    };

    await lists.createFolderlessList("space_456", { name: "Folderless List" });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with list parameters", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "list_new" }),
      } as Response;
    };

    await lists.createFolderlessList("space_456", {
      name: "Folderless List",
      content: "No folder needed",
      due_date: 1704067200000,
      status: "active",
    });

    const body = JSON.parse(capturedBody);
    expect(body.name).toBe("Folderless List");
    expect(body.content).toBe("No folder needed");
    expect(body.due_date).toBe(1704067200000);
    expect(body.status).toBe("active");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "list_folderless",
      name: "Folderless List",
      orderindex: 0,
      content: "No folder needed",
      status: null,
      priority: null,
      assignee: null,
      task_count: 0,
      due_date: null,
      start_date: null,
      folder: { id: "", name: "", hidden: true },
      space: { id: "space_456", name: "Test Space" },
      archived: false,
      override_statuses: false,
      permission_level: "create",
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await lists.createFolderlessList("space_456", {
      name: "Folderless List",
    });

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ message: "Cannot create list in this space" }),
      }) as Response;

    const result = await lists.createFolderlessList("space_999", {
      name: "Folderless List",
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});

describe("Lists - updateList", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const lists = new Lists(config);

  it("should construct correct endpoint with list_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "list_123" }),
      } as Response;
    };

    await lists.updateList("list_123", { name: "Updated List" });

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/list/list_123");
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
        text: async () => JSON.stringify({ id: "list_123" }),
      } as Response;
    };

    await lists.updateList("list_123", { name: "Updated List" });

    expect(capturedMethod).toBe("PUT");
  });

  it("should include request body with update parameters", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "list_123" }),
      } as Response;
    };

    await lists.updateList("list_123", {
      name: "Updated List",
      content: "Updated content",
      priority: 3,
      unset_status: true,
    });

    const body = JSON.parse(capturedBody);
    expect(body.name).toBe("Updated List");
    expect(body.content).toBe("Updated content");
    expect(body.priority).toBe(3);
    expect(body.unset_status).toBe(true);
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "list_123",
      name: "Updated List",
      orderindex: 0,
      content: "Updated content",
      status: null,
      priority: { priority: "high", color: "#ff0000" },
      assignee: null,
      task_count: 15,
      due_date: null,
      start_date: null,
      folder: { id: "folder_123", name: "Test Folder" },
      space: { id: "space_123", name: "Test Space" },
      archived: false,
      override_statuses: false,
      permission_level: "create",
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await lists.updateList("list_123", {
      name: "Updated List",
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
        json: async () => ({ message: "List not found" }),
      }) as Response;

    const result = await lists.updateList("list_999", {
      name: "Updated List",
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Lists - deleteList", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const lists = new Lists(config);

  it("should construct correct endpoint with list_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await lists.deleteList("list_123");

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/list/list_123");
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

    await lists.deleteList("list_123");

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

    await lists.deleteList("list_123");

    expect(capturedBody).toBeUndefined();
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await lists.deleteList("list_123");

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ message: "Cannot delete list" }),
      }) as Response;

    const result = await lists.deleteList("list_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});
