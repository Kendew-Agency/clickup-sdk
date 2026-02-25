import { describe, expect, it } from "vitest";
import { Tasks } from "./tasks.js";
import type { ClickUpConfig } from "../../types/config.types.js";

describe("Tasks - getTasks", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tasks = new Tasks(config);

  it("should construct correct endpoint with list_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ tasks: [], last_page: true }),
      } as Response;
    };

    await tasks.getTasks("list_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/list/list_123/task",
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
        text: async () => JSON.stringify({ tasks: [], last_page: true }),
      } as Response;
    };

    await tasks.getTasks("list_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should include optional query params in query string", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ tasks: [], last_page: true }),
      } as Response;
    };

    await tasks.getTasks("list_123", {
      archived: false,
      page: 2,
      order_by: "created",
      reverse: true,
      subtasks: true,
      statuses: ["open", "in progress"],
      include_closed: false,
      assignees: [123, 456],
      tags: ["urgent", "bug"],
      due_date_gt: 1704067200000,
      due_date_lt: 1704153600000,
    });

    expect(capturedUrl).toContain("archived=false");
    expect(capturedUrl).toContain("page=2");
    expect(capturedUrl).toContain("order_by=created");
    expect(capturedUrl).toContain("reverse=true");
    expect(capturedUrl).toContain("subtasks=true");
    expect(capturedUrl).toContain("include_closed=false");
    expect(capturedUrl).toContain("due_date_gt=1704067200000");
    expect(capturedUrl).toContain("due_date_lt=1704153600000");
  });

  it("should handle successful response", async () => {
    const mockData = {
      tasks: [
        {
          id: "task_123",
          name: "Test Task",
          status: { status: "open" },
        },
      ],
      last_page: false,
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await tasks.getTasks("list_123");

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

    const result = await tasks.getTasks("list_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Tasks - getTask", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tasks = new Tasks(config);

  it("should construct correct endpoint with task_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "task_123", name: "Test" }),
      } as Response;
    };

    await tasks.getTask("task_123");

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/task/task_123");
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
        text: async () => JSON.stringify({ id: "task_123", name: "Test" }),
      } as Response;
    };

    await tasks.getTask("task_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should include custom_task_ids and team_id in query string", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "task_123", name: "Test" }),
      } as Response;
    };

    await tasks.getTask("task_123", {
      custom_task_ids: true,
      team_id: "team_789",
      include_subtasks: true,
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=team_789");
    expect(capturedUrl).toContain("include_subtasks=true");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "task_123",
      name: "Test Task",
      description: "Task description",
      status: { status: "open" },
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await tasks.getTask("task_123");

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Task not found" }),
      }) as Response;

    const result = await tasks.getTask("task_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Tasks - createTask", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tasks = new Tasks(config);

  it("should construct correct endpoint with list_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "task_123", name: "New Task" }),
      } as Response;
    };

    await tasks.createTask("list_123", { name: "New Task" });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/list/list_123/task",
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
        text: async () => JSON.stringify({ id: "task_123", name: "New Task" }),
      } as Response;
    };

    await tasks.createTask("list_123", { name: "New Task" });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with task data", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: "task_123", name: "New Task" }),
      } as Response;
    };

    await tasks.createTask("list_123", {
      name: "New Task",
      description: "Task description",
      assignees: [123, 456],
      tags: ["urgent"],
      status: "open",
      priority: 1,
      due_date: 1704067200000,
      due_date_time: true,
      time_estimate: 3600000,
      start_date: 1704000000000,
      start_date_time: false,
      notify_all: true,
      parent: "parent_task_123",
      links_to: "linked_task_456",
      check_required_custom_fields: true,
      custom_fields: [{ id: "field_1", value: "value_1" }],
    });

    const body = JSON.parse(capturedBody);
    expect(body.name).toBe("New Task");
    expect(body.description).toBe("Task description");
    expect(body.assignees).toEqual([123, 456]);
    expect(body.tags).toEqual(["urgent"]);
    expect(body.status).toBe("open");
    expect(body.priority).toBe(1);
    expect(body.due_date).toBe(1704067200000);
    expect(body.notify_all).toBe(true);
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "task_123",
      name: "New Task",
      description: "Task description",
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await tasks.createTask("list_123", { name: "New Task" });

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Invalid task data" }),
      }) as Response;

    const result = await tasks.createTask("list_123", { name: "" });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(400);
  });
});

describe("Tasks - updateTask", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tasks = new Tasks(config);

  it("should construct correct endpoint with task_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ id: "task_123", name: "Updated Task" }),
      } as Response;
    };

    await tasks.updateTask("task_123", { name: "Updated Task" });

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/task/task_123");
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
          JSON.stringify({ id: "task_123", name: "Updated Task" }),
      } as Response;
    };

    await tasks.updateTask("task_123", { name: "Updated Task" });

    expect(capturedMethod).toBe("PUT");
  });

  it("should include request body with update data", async () => {
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
          JSON.stringify({ id: "task_123", name: "Updated Task" }),
      } as Response;
    };

    await tasks.updateTask("task_123", {
      name: "Updated Task",
      description: "Updated description",
      status: "in progress",
      priority: 2,
      due_date: 1704153600000,
      due_date_time: false,
      parent: "new_parent_123",
      time_estimate: 7200000,
      start_date: 1704100000000,
      start_date_time: true,
      assignees: { add: [789], rem: [123] },
      archived: false,
    });

    const body = JSON.parse(capturedBody);
    expect(body.name).toBe("Updated Task");
    expect(body.description).toBe("Updated description");
    expect(body.status).toBe("in progress");
    expect(body.priority).toBe(2);
    expect(body.assignees).toEqual({ add: [789], rem: [123] });
    expect(body.archived).toBe(false);
  });

  it("should include query params for custom task IDs", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ id: "task_123", name: "Updated Task" }),
      } as Response;
    };

    await tasks.updateTask("task_123", {
      name: "Updated Task",
      custom_task_ids: true,
      team_id: "team_789",
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=team_789");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "task_123",
      name: "Updated Task",
      description: "Updated description",
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await tasks.updateTask("task_123", {
      name: "Updated Task",
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
        json: async () => ({ message: "Task not found" }),
      }) as Response;

    const result = await tasks.updateTask("task_999", {
      name: "Updated Task",
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Tasks - deleteTask", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tasks = new Tasks(config);

  it("should construct correct endpoint with task_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.deleteTask("task_123");

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/task/task_123");
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

    await tasks.deleteTask("task_123");

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

    await tasks.deleteTask("task_123");

    expect(capturedBody).toBeUndefined();
  });

  it("should include query params for custom task IDs", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.deleteTask("task_123", {
      custom_task_ids: true,
      team_id: "team_789",
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=team_789");
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await tasks.deleteTask("task_123");

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ message: "Cannot delete task" }),
      }) as Response;

    const result = await tasks.deleteTask("task_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});

describe("Tasks - addDependency", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tasks = new Tasks(config);

  it("should construct correct endpoint with task_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.addDependency("task_123", { depends_on: "task_456" });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/task/task_123/dependency",
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
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.addDependency("task_123", { depends_on: "task_456" });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with depends_on", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.addDependency("task_123", { depends_on: "task_456" });

    const body = JSON.parse(capturedBody);
    expect(body.depends_on).toBe("task_456");
    expect(body.dependency_of).toBeUndefined();
  });

  it("should include request body with dependency_of", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: RequestInfo | URL,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.addDependency("task_123", { dependency_of: "task_789" });

    const body = JSON.parse(capturedBody);
    expect(body.dependency_of).toBe("task_789");
    expect(body.depends_on).toBeUndefined();
  });

  it("should include query params for custom task IDs", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.addDependency("task_123", {
      depends_on: "task_456",
      custom_task_ids: true,
      team_id: "team_789",
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=team_789");
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await tasks.addDependency("task_123", {
      depends_on: "task_456",
    });

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Invalid dependency" }),
      }) as Response;

    const result = await tasks.addDependency("task_123", {
      depends_on: "task_999",
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(400);
  });
});

describe("Tasks - deleteDependency", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tasks = new Tasks(config);

  it("should construct correct endpoint with task_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.deleteDependency("task_123", { depends_on: "task_456" });

    expect(capturedUrl).toContain(
      "https://api.clickup.com/api/v2/task/task_123/dependency",
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

    await tasks.deleteDependency("task_123", { depends_on: "task_456" });

    expect(capturedMethod).toBe("DELETE");
  });

  it("should include depends_on in query string", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.deleteDependency("task_123", { depends_on: "task_456" });

    expect(capturedUrl).toContain("depends_on=task_456");
  });

  it("should include dependency_of in query string", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.deleteDependency("task_123", { dependency_of: "task_789" });

    expect(capturedUrl).toContain("dependency_of=task_789");
  });

  it("should include query params for custom task IDs", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.deleteDependency("task_123", {
      depends_on: "task_456",
      custom_task_ids: true,
      team_id: "team_789",
    });

    expect(capturedUrl).toContain("depends_on=task_456");
    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=team_789");
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await tasks.deleteDependency("task_123", {
      depends_on: "task_456",
    });

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Dependency not found" }),
      }) as Response;

    const result = await tasks.deleteDependency("task_123", {
      depends_on: "task_999",
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Tasks - addTaskLink", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tasks = new Tasks(config);

  it("should construct correct endpoint with task_id and links_to", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.addTaskLink("task_123", { links_to: "task_456" });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/task/task_123/link/task_456",
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
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.addTaskLink("task_123", { links_to: "task_456" });

    expect(capturedMethod).toBe("POST");
  });

  it("should include query params for custom task IDs", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.addTaskLink("task_123", {
      links_to: "task_456",
      custom_task_ids: true,
      team_id: "team_789",
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=team_789");
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await tasks.addTaskLink("task_123", {
      links_to: "task_456",
    });

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Invalid task link" }),
      }) as Response;

    const result = await tasks.addTaskLink("task_123", {
      links_to: "task_999",
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(400);
  });
});

describe("Tasks - deleteTaskLink", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tasks = new Tasks(config);

  it("should construct correct endpoint with task_id and links_to", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.deleteTaskLink("task_123", { links_to: "task_456" });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/task/task_123/link/task_456",
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

    await tasks.deleteTaskLink("task_123", { links_to: "task_456" });

    expect(capturedMethod).toBe("DELETE");
  });

  it("should include query params for custom task IDs", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await tasks.deleteTaskLink("task_123", {
      links_to: "task_456",
      custom_task_ids: true,
      team_id: "team_789",
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=team_789");
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await tasks.deleteTaskLink("task_123", {
      links_to: "task_456",
    });

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Task link not found" }),
      }) as Response;

    const result = await tasks.deleteTaskLink("task_123", {
      links_to: "task_999",
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});
