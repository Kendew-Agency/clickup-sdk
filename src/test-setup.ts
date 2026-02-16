import { beforeEach, vi } from "vitest";

// Mock fetch globally for all tests
beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();
});

// Create a global fetch mock that can be configured per test
export const createMockFetch = (
  response: {
    ok: boolean;
    status: number;
    statusText?: string;
    json?: () => Promise<unknown>;
    text?: () => Promise<string>;
  } = {
    ok: true,
    status: 200,
    json: async () => ({}),
  },
) => {
  return vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status,
    statusText: response.statusText || "OK",
    json: response.json || (async () => ({})),
    text: response.text || (async () => ""),
  });
};
