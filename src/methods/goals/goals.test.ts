import { describe, expect, it } from "vitest";
import { Goals } from "./goals.js";
import type { ClickUpConfig } from "../../types/config.types.js";

describe("Goals - getGoals", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const goals = new Goals(config);

  it("should construct correct endpoint with team_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string) => {
      capturedUrl = url as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ goals: [], folders: [] }),
      } as Response;
    };

    await goals.getGoals("team_123");

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/team/team_123/goal",
    );
  });

  it("should use GET HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (_url: string, options?: RequestInit) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ goals: [], folders: [] }),
      } as Response;
    };

    await goals.getGoals("team_123");

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      goals: [
        {
          id: "goal_123",
          name: "Q1 Goals",
          team_id: "team_123",
          date_created: "2024-01-01",
          start_date: null,
          due_date: "2024-03-31",
          description: "First quarter goals",
          private: false,
          archived: false,
          creator: 123,
          color: "#32a852",
          pretty_id: "GOAL-1",
          multiple_owners: true,
          folder_id: null,
          members: [],
          owners: [],
          key_results: [],
          percent_completed: 0,
          history: [],
          pretty_url: "https://app.clickup.com/goal/1",
        },
      ],
      folders: [],
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await goals.getGoals("team_123");

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

    const result = await goals.getGoals("team_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Goals - getGoal", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const goals = new Goals(config);

  it("should construct correct endpoint with goal_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string) => {
      capturedUrl = url as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ goal: {} }),
      } as Response;
    };

    await goals.getGoal("goal_456");

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/goal/goal_456");
  });

  it("should use GET HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (_url: string, options?: RequestInit) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ goal: {} }),
      } as Response;
    };

    await goals.getGoal("goal_456");

    expect(capturedMethod).toBe("GET");
  });

  it("should handle successful response", async () => {
    const mockData = {
      goal: {
        id: "goal_456",
        name: "Revenue Target",
        team_id: "team_123",
        date_created: "2024-01-01",
        start_date: null,
        due_date: "2024-12-31",
        description: "Annual revenue goal",
        private: false,
        archived: false,
        creator: 456,
        color: "#e44332",
        pretty_id: "GOAL-2",
        multiple_owners: false,
        folder_id: null,
        members: [],
        owners: [],
        key_results: [],
        percent_completed: 25,
        history: [],
        pretty_url: "https://app.clickup.com/goal/2",
      },
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await goals.getGoal("goal_456");

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

    const result = await goals.getGoal("goal_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});

describe("Goals - createGoal", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const goals = new Goals(config);

  it("should construct correct endpoint with team_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string) => {
      capturedUrl = url as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ goal: {} }),
      } as Response;
    };

    await goals.createGoal("team_789", { name: "New Goal" });

    expect(capturedUrl).toBe(
      "https://api.clickup.com/api/v2/team/team_789/goal",
    );
  });

  it("should use POST HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (_url: string, options?: RequestInit) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ goal: {} }),
      } as Response;
    };

    await goals.createGoal("team_789", { name: "New Goal" });

    expect(capturedMethod).toBe("POST");
  });

  it("should send request body with goal parameters", async () => {
    let capturedBody: string | undefined;
    globalThis.fetch = async (_url: string, options?: RequestInit) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ goal: {} }),
      } as Response;
    };

    const params = {
      name: "Q2 Goals",
      due_date: 1719792000000,
      description: "Second quarter objectives",
      multiple_owners: true,
      owners: [123, 456],
      color: "#32a852",
    };

    await goals.createGoal("team_789", params);

    expect(capturedBody).toBeDefined();
    const parsedBody = JSON.parse(capturedBody as string);
    expect(parsedBody).toEqual(params);
  });

  it("should handle successful response", async () => {
    const mockData = {
      goal: {
        id: "goal_new",
        name: "Q2 Goals",
        team_id: "team_789",
        date_created: "2024-01-15",
        start_date: null,
        due_date: "2024-06-30",
        description: "Second quarter objectives",
        private: false,
        archived: false,
        creator: 789,
        color: "#32a852",
        pretty_id: "GOAL-3",
        multiple_owners: true,
        folder_id: null,
        members: [],
        owners: [],
        key_results: [],
        percent_completed: 0,
        history: [],
        pretty_url: "https://app.clickup.com/goal/3",
      },
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await goals.createGoal("team_789", { name: "Q2 Goals" });

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Invalid goal parameters" }),
      }) as Response;

    const result = await goals.createGoal("team_999", { name: "" });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(400);
  });
});

describe("Goals - updateGoal", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const goals = new Goals(config);

  it("should construct correct endpoint with goal_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string) => {
      capturedUrl = url as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ goal: {} }),
      } as Response;
    };

    await goals.updateGoal("goal_update", { name: "Updated Goal" });

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/goal/goal_update");
  });

  it("should use PUT HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (_url: string, options?: RequestInit) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ goal: {} }),
      } as Response;
    };

    await goals.updateGoal("goal_update", { name: "Updated Goal" });

    expect(capturedMethod).toBe("PUT");
  });

  it("should send request body with update parameters", async () => {
    let capturedBody: string | undefined;
    globalThis.fetch = async (_url: string, options?: RequestInit) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ goal: {} }),
      } as Response;
    };

    const params = {
      name: "Updated Q2 Goals",
      due_date: 1722470400000,
      description: "Revised objectives",
      rem_owners: [123],
      add_owners: [789],
      color: "#e44332",
    };

    await goals.updateGoal("goal_update", params);

    expect(capturedBody).toBeDefined();
    const parsedBody = JSON.parse(capturedBody as string);
    expect(parsedBody).toEqual(params);
  });

  it("should handle successful response", async () => {
    const mockData = {
      goal: {
        id: "goal_update",
        name: "Updated Q2 Goals",
        team_id: "team_789",
        date_created: "2024-01-15",
        start_date: null,
        due_date: "2024-07-31",
        description: "Revised objectives",
        private: false,
        archived: false,
        creator: 789,
        color: "#e44332",
        pretty_id: "GOAL-3",
        multiple_owners: true,
        folder_id: null,
        members: [],
        owners: [],
        key_results: [],
        percent_completed: 50,
        history: [],
        pretty_url: "https://app.clickup.com/goal/3",
      },
    };
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      }) as Response;

    const result = await goals.updateGoal("goal_update", {
      name: "Updated Q2 Goals",
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
        json: async () => ({ message: "Goal not found" }),
      }) as Response;

    const result = await goals.updateGoal("goal_999", { name: "Updated" });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(404);
  });
});

describe("Goals - deleteGoal", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const goals = new Goals(config);

  it("should construct correct endpoint with goal_id", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (url: string) => {
      capturedUrl = url as string;
      return {
        ok: true,
        status: 200,
        text: async () => "",
      } as Response;
    };

    await goals.deleteGoal("goal_delete");

    expect(capturedUrl).toBe("https://api.clickup.com/api/v2/goal/goal_delete");
  });

  it("should use DELETE HTTP method", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (_url: string, options?: RequestInit) => {
      capturedMethod = options?.method || "GET";
      return {
        ok: true,
        status: 200,
        text: async () => "",
      } as Response;
    };

    await goals.deleteGoal("goal_delete");

    expect(capturedMethod).toBe("DELETE");
  });

  it("should not send request body", async () => {
    let capturedBody: string | undefined;
    globalThis.fetch = async (_url: string, options?: RequestInit) => {
      capturedBody = options?.body as string;
      return {
        ok: true,
        status: 200,
        text: async () => "",
      } as Response;
    };

    await goals.deleteGoal("goal_delete");

    expect(capturedBody).toBeUndefined();
  });

  it("should handle successful response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => "",
      }) as Response;

    const result = await goals.deleteGoal("goal_delete");

    expect(result.data).toEqual({});
    expect(result.error).toBeNull();
  });

  it("should handle error response", async () => {
    globalThis.fetch = async () =>
      ({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ message: "Cannot delete goal" }),
      }) as Response;

    const result = await goals.deleteGoal("goal_999");

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error?.statusCode).toBe(403);
  });
});
