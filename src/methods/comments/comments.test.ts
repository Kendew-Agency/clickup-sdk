import { describe, expect, it } from "vitest";
import { Comments } from "./comments.js";
import type { ClickUpConfig } from "../../types/config.types.js";

describe("Comments - getTaskComments", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const comments = new Comments(config);

  it("should construct correct endpoint with task_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getTaskComments("task_123", {});

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/task/task_123/comment",
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
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getTaskComments("task_123", {});

    expect(capturedMethod).toBe("GET");
  });

  it("should include pagination params in query string", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getTaskComments("task_123", {
      start: 10,
      start_id: "comment_456",
    });

    expect(capturedUrl).toContain("start=10");
    expect(capturedUrl).toContain("start_id=comment_456");
  });

  it("should include custom_task_ids and team_id in query string", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getTaskComments("task_123", {
      custom_task_ids: true,
      team_id: "team_789",
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=team_789");
  });

  it("should handle successful response", async () => {
    const mockData = {
      comments: [
        {
          id: "comment_123",
          comment: [{ text: "Test comment" }],
          comment_text: "Test comment",
          user: { id: 1, username: "testuser", email: "test@example.com" },
          resolved: false,
          assignee: null,
          assigned_by: null,
          reply_count: 0,
          date: "1704067200000",
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await comments.getTaskComments("task_123", {});

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

    const result = await comments.getTaskComments("task_999", {});

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Comments - createTaskComment", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const comments = new Comments(config);

  it("should construct correct endpoint with task_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ id: "comment_123", hist_id: "hist_123", date: 0 }),
      } as Response;
    };

    await comments.createTaskComment("task_123", {
      comment_text: "New comment",
      notify_all: true,
    });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/task/task_123/comment",
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
          JSON.stringify({ id: "comment_123", hist_id: "hist_123", date: 0 }),
      } as Response;
    };

    await comments.createTaskComment("task_123", {
      comment_text: "New comment",
      notify_all: true,
    });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with comment data", async () => {
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
          JSON.stringify({ id: "comment_123", hist_id: "hist_123", date: 0 }),
      } as Response;
    };

    await comments.createTaskComment("task_123", {
      comment_text: "New comment",
      assignee: 123,
      notify_all: true,
    });

    const body = JSON.parse(capturedBody);
    expect(body.comment_text).toBe("New comment");
    expect(body.assignee).toBe(123);
    expect(body.notify_all).toBe(true);
  });

  it("should include custom_task_ids and team_id in query string", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ id: "comment_123", hist_id: "hist_123", date: 0 }),
      } as Response;
    };

    await comments.createTaskComment("task_123", {
      comment_text: "New comment",
      notify_all: true,
      custom_task_ids: true,
      team_id: "team_789",
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=team_789");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "comment_123",
      hist_id: "hist_456",
      date: 1704067200000,
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await comments.createTaskComment("task_123", {
      comment_text: "New comment",
      notify_all: true,
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
        json: async () => ({ message: "Invalid comment data" }),
      }) as Response;

    const result = await comments.createTaskComment("task_123", {
      comment_text: "",
      notify_all: true,
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(400);
  });
});

describe("Comments - getChatViewComments", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const comments = new Comments(config);

  it("should construct correct endpoint with view_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getChatViewComments("view_123", {});

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/view/view_123/comment",
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
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getChatViewComments("view_123", {});

    expect(capturedMethod).toBe("GET");
  });

  it("should include pagination params in query string", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getChatViewComments("view_123", {
      start: 5,
      start_id: "comment_789",
    });

    expect(capturedUrl).toContain("start=5");
    expect(capturedUrl).toContain("start_id=comment_789");
  });

  it("should handle successful response", async () => {
    const mockData = {
      comments: [
        {
          id: "comment_456",
          comment: [{ text: "Chat comment" }],
          comment_text: "Chat comment",
          user: { id: 2, username: "chatuser", email: "chat@example.com" },
          resolved: false,
          assignee: null,
          assigned_by: null,
          reply_count: 2,
          date: "1704067200000",
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await comments.getChatViewComments("view_123", {});

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

    const result = await comments.getChatViewComments("view_999", {});

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});

describe("Comments - createChatViewComment", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const comments = new Comments(config);

  it("should construct correct endpoint with view_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ id: "comment_123", hist_id: "hist_123", date: 0 }),
      } as Response;
    };

    await comments.createChatViewComment("view_123", {
      comment_text: "Chat comment",
      notify_all: false,
    });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/view/view_123/comment",
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
          JSON.stringify({ id: "comment_123", hist_id: "hist_123", date: 0 }),
      } as Response;
    };

    await comments.createChatViewComment("view_123", {
      comment_text: "Chat comment",
      notify_all: false,
    });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with comment data", async () => {
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
          JSON.stringify({ id: "comment_123", hist_id: "hist_123", date: 0 }),
      } as Response;
    };

    await comments.createChatViewComment("view_123", {
      comment_text: "Chat comment",
      notify_all: true,
    });

    const body = JSON.parse(capturedBody);
    expect(body.comment_text).toBe("Chat comment");
    expect(body.notify_all).toBe(true);
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "comment_789",
      hist_id: "hist_789",
      date: 1704067200000,
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await comments.createChatViewComment("view_123", {
      comment_text: "Chat comment",
      notify_all: false,
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
        json: async () => ({ message: "View not found" }),
      }) as Response;

    const result = await comments.createChatViewComment("view_999", {
      comment_text: "Chat comment",
      notify_all: false,
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Comments - getListComments", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const comments = new Comments(config);

  it("should construct correct endpoint with list_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getListComments("list_123", {});

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/list/list_123/comment",
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
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getListComments("list_123", {});

    expect(capturedMethod).toBe("GET");
  });

  it("should include pagination params in query string", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getListComments("list_123", {
      start: 15,
      start_id: "comment_abc",
    });

    expect(capturedUrl).toContain("start=15");
    expect(capturedUrl).toContain("start_id=comment_abc");
  });

  it("should handle successful response", async () => {
    const mockData = {
      comments: [
        {
          id: "comment_list_1",
          comment: [{ text: "List comment" }],
          comment_text: "List comment",
          user: { id: 3, username: "listuser", email: "list@example.com" },
          resolved: true,
          assignee: null,
          assigned_by: null,
          reply_count: 1,
          date: "1704067200000",
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await comments.getListComments("list_123", {});

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Server error" }),
      }) as Response;

    const result = await comments.getListComments("list_999", {});

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(500);
  });
});

describe("Comments - createListComment", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const comments = new Comments(config);

  it("should construct correct endpoint with list_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ id: "comment_123", hist_id: "hist_123", date: 0 }),
      } as Response;
    };

    await comments.createListComment("list_123", {
      comment_text: "List comment",
      notify_all: true,
    });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/list/list_123/comment",
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
          JSON.stringify({ id: "comment_123", hist_id: "hist_123", date: 0 }),
      } as Response;
    };

    await comments.createListComment("list_123", {
      comment_text: "List comment",
      notify_all: true,
    });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with comment data", async () => {
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
          JSON.stringify({ id: "comment_123", hist_id: "hist_123", date: 0 }),
      } as Response;
    };

    await comments.createListComment("list_123", {
      comment_text: "List comment",
      assignee: 456,
      notify_all: false,
    });

    const body = JSON.parse(capturedBody);
    expect(body.comment_text).toBe("List comment");
    expect(body.assignee).toBe(456);
    expect(body.notify_all).toBe(false);
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "comment_list_123",
      hist_id: "hist_list_123",
      date: 1704067200000,
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await comments.createListComment("list_123", {
      comment_text: "List comment",
      notify_all: true,
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
        json: async () => ({ message: "Invalid token" }),
      }) as Response;

    const result = await comments.createListComment("list_123", {
      comment_text: "List comment",
      notify_all: true,
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(401);
  });
});

describe("Comments - updateComment", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const comments = new Comments(config);

  it("should construct correct endpoint with comment_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await comments.updateComment("comment_123", {
      comment_text: "Updated comment",
    });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/comment/comment_123",
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
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await comments.updateComment("comment_123", {
      comment_text: "Updated comment",
    });

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
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await comments.updateComment("comment_123", {
      comment_text: "Updated comment",
      resolved: true,
      assignee: 789,
    });

    const body = JSON.parse(capturedBody);
    expect(body.comment_text).toBe("Updated comment");
    expect(body.resolved).toBe(true);
    expect(body.assignee).toBe(789);
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await comments.updateComment("comment_123", {
      comment_text: "Updated comment",
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
        json: async () => ({ message: "Comment not found" }),
      }) as Response;

    const result = await comments.updateComment("comment_999", {
      comment_text: "Updated comment",
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Comments - deleteComment", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const comments = new Comments(config);

  it("should construct correct endpoint with comment_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await comments.deleteComment("comment_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/comment/comment_123",
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

    await comments.deleteComment("comment_123");

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

    await comments.deleteComment("comment_123");

    expect(capturedBody).toBeUndefined();
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await comments.deleteComment("comment_123");

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ message: "Cannot delete comment" }),
      }) as Response;

    const result = await comments.deleteComment("comment_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});

describe("Comments - getThreadedComments", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const comments = new Comments(config);

  it("should construct correct endpoint with comment_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getThreadedComments("comment_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/comment/comment_123/reply",
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
        text: async () => JSON.stringify({ comments: [] }),
      } as Response;
    };

    await comments.getThreadedComments("comment_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      comments: [
        {
          id: "reply_1",
          comment: [{ text: "Reply comment" }],
          comment_text: "Reply comment",
          user: { id: 4, username: "replyuser", email: "reply@example.com" },
          resolved: false,
          assignee: null,
          assigned_by: null,
          reply_count: 0,
          date: "1704067200000",
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await comments.getThreadedComments("comment_123");

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Comment not found" }),
      }) as Response;

    const result = await comments.getThreadedComments("comment_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Comments - createThreadedComment", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const comments = new Comments(config);

  it("should construct correct endpoint with comment_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await comments.createThreadedComment("comment_123", {
      comment_text: "Threaded reply",
      notify_all: false,
    });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/comment/comment_123/reply",
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

    await comments.createThreadedComment("comment_123", {
      comment_text: "Threaded reply",
      notify_all: false,
    });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with comment data", async () => {
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

    await comments.createThreadedComment("comment_123", {
      comment_text: "Threaded reply",
      assignee: 999,
      notify_all: true,
    });

    const body = JSON.parse(capturedBody);
    expect(body.comment_text).toBe("Threaded reply");
    expect(body.assignee).toBe(999);
    expect(body.notify_all).toBe(true);
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await comments.createThreadedComment("comment_123", {
      comment_text: "Threaded reply",
      notify_all: false,
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
        json: async () => ({ message: "Invalid reply data" }),
      }) as Response;

    const result = await comments.createThreadedComment("comment_999", {
      comment_text: "",
      notify_all: false,
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(400);
  });
});
