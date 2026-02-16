import { describe, expect, it } from "vitest";
import { CustomTaskTypes } from "./custom-task-types.js";
import type { ClickUpConfig } from "../../types/config.types.js";

describe("CustomTaskTypes - getCustomTaskTypes", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const customTaskTypes = new CustomTaskTypes(config);

  it("should construct correct endpoint with team_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ custom_items: [] }),
      } as Response;
    };

    await customTaskTypes.getCustomTaskTypes(123);

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/team/123/custom_item",
    );
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
        text: async () => JSON.stringify({ custom_items: [] }),
      } as Response;
    };

    await customTaskTypes.getCustomTaskTypes(123);

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      custom_items: [
        {
          id: "custom_123",
          name: "Bug",
          description: "Bug tracking task type",
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await customTaskTypes.getCustomTaskTypes(123);

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

    const result = await customTaskTypes.getCustomTaskTypes(999);

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});
