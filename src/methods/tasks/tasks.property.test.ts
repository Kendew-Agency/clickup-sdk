import fc from "fast-check";
import { describe, expect, it } from "vitest";
import type { ClickUpConfig } from "../../types/config.types.js";
import { Tasks } from "./tasks.js";
import type { TaskCustomFieldInput } from "./types.js";

// Adding 0 normalizes -0 to 0, which survives a JSON round trip.
const finiteNumber = fc
  .double({ noNaN: true, noDefaultInfinity: true })
  .map((n) => n + 0);

const addRemove = fc.record(
  {
    add: fc.array(fc.string(), { maxLength: 5 }),
    rem: fc.array(fc.string(), { maxLength: 5 }),
  },
  { requiredKeys: [] },
);

const id = fc.string();

const customFieldInput: fc.Arbitrary<TaskCustomFieldInput> = fc.oneof(
  ...(
    [
      "url",
      "drop_down",
      "email",
      "phone",
      "short_text",
      "text",
      "long_text",
    ] as const
  ).map((type) =>
    fc.record({ id, type: fc.constant(type), value: fc.string() }),
  ),
  fc.record({
    id,
    type: fc.constant("labels" as const),
    value: fc.array(fc.string(), { maxLength: 5 }),
  }),
  fc.record(
    {
      id,
      type: fc.constant("date" as const),
      value: fc.integer(),
      value_options: fc.record({ time: fc.boolean() }),
    },
    { requiredKeys: ["id", "type", "value"] },
  ),
  fc.record({
    id,
    type: fc.constant("checkbox" as const),
    value: fc.boolean(),
  }),
  ...(["number", "currency", "emoji"] as const).map((type) =>
    fc.record({ id, type: fc.constant(type), value: finiteNumber }),
  ),
  ...(["tasks", "relationship", "users"] as const).map((type) =>
    fc.record({ id, type: fc.constant(type), value: addRemove }),
  ),
  fc.record({
    id,
    type: fc.constant("manual_progress" as const),
    value: fc.record({ current: finiteNumber }),
  }),
  fc.record({
    id,
    type: fc.constant("location" as const),
    value: fc.record({
      location: fc.record({ lat: finiteNumber, lng: finiteNumber }),
      formatted_address: fc.string(),
    }),
  }),
);

describe("Tasks - createTask properties", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const tasks = new Tasks(config);

  // Feature: custom-fields-type-safety, Property 2: Task create custom_fields mapping excludes type
  // **Validates: Requirements 3.2**
  it("maps custom_fields without type, preserving order, id, value and value_options", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(customFieldInput, { maxLength: 8 }),
        async (inputs) => {
          let captured: string | undefined;
          globalThis.fetch = async (
            _url: RequestInfo | URL,
            options?: RequestInit,
          ) => {
            captured = options?.body as string;
            return {
              ok: true,
              status: 200,
              text: async () => JSON.stringify({ id: "t1" }),
            } as Response;
          };

          await tasks.createTask("list_1", {
            name: "Task",
            custom_fields: inputs,
          });

          const sent = JSON.parse(captured ?? "{}") as {
            custom_fields: Record<string, unknown>[];
          };

          expect(sent.custom_fields).toHaveLength(inputs.length);
          inputs.forEach((input, i) => {
            const out = sent.custom_fields[i];
            expect(out).not.toHaveProperty("type");
            expect(out.id).toEqual(input.id);
            expect(out.value).toEqual(input.value);
            if ("value_options" in input && input.value_options !== undefined) {
              expect(out.value_options).toEqual(input.value_options);
            } else {
              expect(out).not.toHaveProperty("value_options");
            }
          });
        },
      ),
      { numRuns: 100 },
    );
  });
});
