import fc from "fast-check";
import { describe, expect, it } from "vitest";
import type { ClickUpConfig } from "../../types/config.types.js";
import { CustomFields } from "./custom-fields.js";
import type { CustomFieldValueInput } from "./types.js";

const num = fc.double({ noNaN: true, noDefaultInfinity: true });
const strings = fc.string();
const addRemove = fc.record(
  { add: fc.array(strings), rem: fc.array(strings) },
  { requiredKeys: [] },
);

const customFieldValueInputArb: fc.Arbitrary<CustomFieldValueInput> = fc.oneof(
  strings.map((value) => ({ type: "url" as const, value })),
  strings.map((value) => ({ type: "drop_down" as const, value })),
  fc.array(strings).map((value) => ({ type: "labels" as const, value })),
  strings.map((value) => ({ type: "email" as const, value })),
  strings.map((value) => ({ type: "phone" as const, value })),
  fc.oneof(
    num.map((value) => ({ type: "date" as const, value })),
    fc
      .tuple(num, fc.record({ time: fc.boolean() }, { requiredKeys: [] }))
      .map(([value, valueOptions]) => ({
        type: "date" as const,
        value,
        value_options: valueOptions,
      })),
  ),
  strings.map((value) => ({ type: "short_text" as const, value })),
  strings.map((value) => ({ type: "text" as const, value })),
  strings.map((value) => ({ type: "long_text" as const, value })),
  fc.boolean().map((value) => ({ type: "checkbox" as const, value })),
  num.map((value) => ({ type: "number" as const, value })),
  num.map((value) => ({ type: "currency" as const, value })),
  addRemove.map((value) => ({ type: "tasks" as const, value })),
  addRemove.map((value) => ({ type: "relationship" as const, value })),
  addRemove.map((value) => ({ type: "users" as const, value })),
  fc.nat(5).map((value) => ({ type: "emoji" as const, value })),
  num.map((current) => ({
    type: "manual_progress" as const,
    value: { current },
  })),
  fc
    .record({
      location: fc.record({ lat: num, lng: num }),
      formatted_address: strings,
    })
    .map((value) => ({ type: "location" as const, value })),
);

describe("CustomFields - setCustomFieldValue properties", () => {
  const config: ClickUpConfig = { apiToken: "test_token_123" };
  const customFields = new CustomFields(config);

  // Feature: custom-fields-type-safety, Property 1: Single-field request body excludes `type`
  // **Validates: Requirements 2.2**
  it("Property 1: request body excludes type and keeps value", async () => {
    await fc.assert(
      fc.asyncProperty(
        customFieldValueInputArb,
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        async (input, taskId, fieldId) => {
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

          await customFields.setCustomFieldValue(taskId, fieldId, input);

          const body = JSON.parse(capturedBody);
          expect(body).not.toHaveProperty("type");
          expect(body.value).toEqual(JSON.parse(JSON.stringify(input.value)));

          const hasOptions = "value_options" in input;
          expect("value_options" in body).toBe(hasOptions);
          if ("value_options" in input) {
            expect(body.value_options).toEqual(input.value_options);
          }
          expect(Object.keys(body).sort()).toEqual(
            hasOptions ? ["value", "value_options"] : ["value"],
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});
