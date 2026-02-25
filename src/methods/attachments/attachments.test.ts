import { describe, expect, it } from "vitest";
import { Attachments } from "./attachments.js";
import type { ClickUpConfig } from "../../types/config.types.js";

describe("Attachments - createTaskAttachment", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const attachments = new Attachments(config);

  it("should construct correct endpoint with task_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ id: "attachment_123", url: "https://example.com" }),
      } as Response;
    };

    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    await attachments.createTaskAttachment("task_123", {
      attachment: mockFile,
    });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/task/task_123/attachment",
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
          JSON.stringify({ id: "attachment_123", url: "https://example.com" }),
      } as Response;
    };

    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    await attachments.createTaskAttachment("task_123", {
      attachment: mockFile,
    });

    expect(capturedMethod).toBe("POST");
  });

  it("should include custom_task_ids in query string when provided", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ id: "attachment_123", url: "https://example.com" }),
      } as Response;
    };

    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    await attachments.createTaskAttachment("task_123", {
      attachment: mockFile,
      custom_task_ids: true,
      team_id: 123,
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
  });

  it("should include team_id in query string when provided", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ id: "attachment_123", url: "https://example.com" }),
      } as Response;
    };

    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    await attachments.createTaskAttachment("task_123", {
      attachment: mockFile,
      team_id: 456,
    });

    expect(capturedUrl).toContain("team_id=456");
  });

  it("should include both custom_task_ids and team_id when provided", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: RequestInfo | URL) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ id: "attachment_123", url: "https://example.com" }),
      } as Response;
    };

    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    await attachments.createTaskAttachment("task_123", {
      attachment: mockFile,
      custom_task_ids: true,
      team_id: 789,
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=789");
  });

  it("should handle successful response", async () => {
    const mockData = {
      id: "attachment_123",
      version: 1,
      date: 1704067200000,
      title: "test.txt",
      extension: "txt",
      thumbnail_small: null,
      thumbnail_medium: null,
      thumbnail_large: null,
      url: "https://example.com/test.txt",
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    const result = await attachments.createTaskAttachment("task_123", {
      attachment: mockFile,
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

    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    const result = await attachments.createTaskAttachment("task_999", {
      attachment: mockFile,
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });

  it("should handle server error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Server error" }),
      }) as Response;

    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    const result = await attachments.createTaskAttachment("task_123", {
      attachment: mockFile,
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(500);
  });
});
