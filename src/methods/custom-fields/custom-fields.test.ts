import { describe, expect, it } from "vitest";
import { CustomFields } from "./custom-fields.js";
import type { ClickUpConfig } from "../../types/config.types.js";

describe("CustomFields - getListCustomFields", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const customFields = new CustomFields(config);

  it("should construct correct endpoint with list_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ fields: [] }),
      } as Response;
    };

    await customFields.getListCustomFields("list_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/list/list_123/field",
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
        text: async () => JSON.stringify({ fields: [] }),
      } as Response;
    };

    await customFields.getListCustomFields("list_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      fields: [
        {
          id: "field_123",
          name: "Priority",
          type: "drop_down",
          type_config: {},
          date_created: "2024-01-01",
          hide_from_guests: false,
          required: true,
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await customFields.getListCustomFields("list_123");

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

    const result = await customFields.getListCustomFields("list_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("CustomFields - getSpaceCustomFields", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const customFields = new CustomFields(config);

  it("should construct correct endpoint with space_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ fields: [] }),
      } as Response;
    };

    await customFields.getSpaceCustomFields("space_456");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/space/space_456/field",
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
        text: async () => JSON.stringify({ fields: [] }),
      } as Response;
    };

    await customFields.getSpaceCustomFields("space_456");

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      fields: [
        {
          id: "field_456",
          name: "Status",
          type: "labels",
          type_config: {},
          date_created: "2024-01-02",
          hide_from_guests: true,
          required: false,
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await customFields.getSpaceCustomFields("space_456");

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

    const result = await customFields.getSpaceCustomFields("space_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});

describe("CustomFields - getWorkspaceCustomFields", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const customFields = new CustomFields(config);

  it("should construct correct endpoint with team_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ fields: [] }),
      } as Response;
    };

    await customFields.getWorkspaceCustomFields("team_789");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/team/team_789/field",
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
        text: async () => JSON.stringify({ fields: [] }),
      } as Response;
    };

    await customFields.getWorkspaceCustomFields("team_789");

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      fields: [
        {
          id: "field_789",
          name: "Budget",
          type: "currency",
          type_config: { currency_type: "USD", default: 0, precision: 2 },
          date_created: "2024-01-03",
          hide_from_guests: false,
          required: true,
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await customFields.getWorkspaceCustomFields("team_789");

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

    const result = await customFields.getWorkspaceCustomFields("team_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(500);
  });
});

describe("CustomFields - getFolderCustomFields", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const customFields = new CustomFields(config);

  it("should construct correct endpoint with folder_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ fields: [] }),
      } as Response;
    };

    await customFields.getFolderCustomFields("folder_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/folder/folder_123/field",
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
        text: async () => JSON.stringify({ fields: [] }),
      } as Response;
    };

    await customFields.getFolderCustomFields("folder_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      fields: [
        {
          id: "field_123",
          name: "Priority",
          type: "drop_down",
          type_config: {},
          date_created: "1704067200000",
          hide_from_guests: false,
          required: false,
        },
      ],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await customFields.getFolderCustomFields("folder_123");

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

    const result = await customFields.getFolderCustomFields("folder_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("CustomFields - setCustomFieldValue", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const customFields = new CustomFields(config);

  it("should construct correct endpoint with task_id and field_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await customFields.setCustomFieldValue("task_123", "field_456", {
      value: "high",
    });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/task/task_123/field/field_456",
    );
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
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await customFields.setCustomFieldValue("task_123", "field_456", {
      value: "high",
    });

    expect(capturedMethod).toBe("POST");
  });

  it("should include request body with value and value_options", async () => {
    let capturedBody = "";
    globalThis.fetch = async (
      _url: string | URL | Request,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await customFields.setCustomFieldValue("task_123", "field_456", {
      value: 1704067200000,
      value_options: { time: true },
    });

    const body = JSON.parse(capturedBody);
    expect(body.value).toBe(1704067200000);
    expect(body.value_options).toEqual({ time: true });
  });

  it("should include query params for custom task IDs", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await customFields.setCustomFieldValue("task_123", "field_456", {
      value: "high",
      custom_task_ids: true,
      team_id: 789,
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=789");
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await customFields.setCustomFieldValue(
      "task_123",
      "field_456",
      { value: "high" },
    );

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Invalid field value" }),
      }) as Response;

    const result = await customFields.setCustomFieldValue(
      "task_123",
      "field_999",
      { value: "high" },
    );

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(400);
  });
});

describe("CustomFields - removeCustomFieldValue", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const customFields = new CustomFields(config);

  it("should construct correct endpoint with task_id and field_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await customFields.removeCustomFieldValue("task_123", "field_456");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/task/task_123/field/field_456",
    );
  });

  it("should use DELETE HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (
      _url: string | URL | Request,
      options?: RequestInit,
    ) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await customFields.removeCustomFieldValue("task_123", "field_456");

    expect(capturedMethod).toBe("DELETE");
  });

  it("should not include request body", async () => {
    let capturedBody: string | undefined;
    globalThis.fetch = async (
      _url: string | URL | Request,
      options?: RequestInit,
    ) => {
      capturedBody = options?.body as string | undefined;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await customFields.removeCustomFieldValue("task_123", "field_456");

    expect(capturedBody).toBeUndefined();
  });

  it("should include query params for custom task IDs", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      } as Response;
    };

    await customFields.removeCustomFieldValue("task_123", "field_456", {
      custom_task_ids: true,
      team_id: 789,
    });

    expect(capturedUrl).toContain("custom_task_ids=true");
    expect(capturedUrl).toContain("team_id=789");
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      }) as Response;

    const result = await customFields.removeCustomFieldValue(
      "task_123",
      "field_456",
    );

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Field not found" }),
      }) as Response;

    const result = await customFields.removeCustomFieldValue(
      "task_123",
      "field_999",
    );

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});
