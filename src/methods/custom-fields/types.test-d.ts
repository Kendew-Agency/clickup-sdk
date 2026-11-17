import { describe, expectTypeOf, it } from "vitest";
import type {
  GetFilteredTeamTasksParams,
  GetTaskParams,
  UpdateTaskParams,
} from "../tasks/types";
import { cf } from "../../utils/custom-fields";
import type {
  CustomFieldFilter,
  CustomFieldValueInput,
  SetCustomFieldValueParams,
  SettableCustomFieldType,
} from "./types";

// Compile-time tests. They are checked by `pnpm typecheck` (tsc --noEmit)
// and have no runtime assertions.

describe("CustomFieldValueInput", () => {
  it("accepts a valid type/value pair for every settable type", () => {
    const valid: CustomFieldValueInput[] = [
      { type: "url", value: "https://example.com" },
      { type: "drop_down", value: "option-id" },
      { type: "labels", value: ["a", "b"] },
      { type: "email", value: "a@b.c" },
      { type: "phone", value: "+31600000000" },
      { type: "date", value: 1700000000000 },
      { type: "date", value: 1700000000000, value_options: { time: true } },
      { type: "short_text", value: "x" },
      { type: "text", value: "x" },
      { type: "long_text", value: "x" },
      { type: "checkbox", value: true },
      { type: "number", value: 1 },
      { type: "currency", value: 1 },
      { type: "tasks", value: { add: ["t1"], rem: ["t2"] } },
      { type: "relationship", value: { add: ["t1"] } },
      { type: "users", value: { rem: ["u1"] } },
      { type: "emoji", value: 3 },
      { type: "manual_progress", value: { current: 5 } },
      {
        type: "location",
        value: { location: { lat: 1, lng: 2 }, formatted_address: "x" },
      },
    ];
    expectTypeOf(valid).toEqualTypeOf<CustomFieldValueInput[]>();
  });

  it("rejects mismatched type/value pairs", () => {
    // @ts-expect-error url takes a string
    const url: CustomFieldValueInput = { type: "url", value: 1 };
    // @ts-expect-error drop_down takes a string
    const dropDown: CustomFieldValueInput = { type: "drop_down", value: 1 };
    // @ts-expect-error labels takes a string array
    const labels: CustomFieldValueInput = { type: "labels", value: "a" };
    // @ts-expect-error email takes a string
    const email: CustomFieldValueInput = { type: "email", value: 1 };
    // @ts-expect-error phone takes a string
    const phone: CustomFieldValueInput = { type: "phone", value: 1 };
    // @ts-expect-error short_text takes a string
    const shortText: CustomFieldValueInput = { type: "short_text", value: 1 };
    // @ts-expect-error text takes a string
    const text: CustomFieldValueInput = { type: "text", value: 1 };
    // @ts-expect-error long_text takes a string
    const longText: CustomFieldValueInput = { type: "long_text", value: 1 };
    // @ts-expect-error checkbox takes a boolean
    const checkbox: CustomFieldValueInput = { type: "checkbox", value: "yes" };
    // @ts-expect-error number takes a number
    const num: CustomFieldValueInput = { type: "number", value: "1" };
    // @ts-expect-error currency takes a number
    const currency: CustomFieldValueInput = { type: "currency", value: "1" };
    // @ts-expect-error tasks takes an add/rem object
    const tasks: CustomFieldValueInput = { type: "tasks", value: ["t1"] };
    // @ts-expect-error relationship takes an add/rem object
    const rel: CustomFieldValueInput = { type: "relationship", value: "t1" };
    // @ts-expect-error users add/rem hold string ids
    const users: CustomFieldValueInput = { type: "users", value: { add: [1] } };
    // @ts-expect-error emoji takes a number
    const emoji: CustomFieldValueInput = { type: "emoji", value: "3" };
    // @ts-expect-error manual_progress takes { current }
    const progress: CustomFieldValueInput = {
      type: "manual_progress",
      value: 5,
    };
    // @ts-expect-error location takes a location object
    const location: CustomFieldValueInput = { type: "location", value: "x" };
    void [
      url,
      dropDown,
      labels,
      email,
      phone,
      shortText,
      text,
      longText,
      checkbox,
      num,
      currency,
      tasks,
      rel,
      users,
      emoji,
      progress,
      location,
    ];
  });

  it("takes a number for date", () => {
    // @ts-expect-error date takes a number, not a string
    const asString: CustomFieldValueInput = { type: "date", value: "2024" };
    const badOptions: CustomFieldValueInput = {
      type: "date",
      value: 1,
      // @ts-expect-error value_options.time must be a boolean
      value_options: { time: "yes" },
    };
    void [asString, badOptions];
  });

  it("rejects automatic_progress and the empty object", () => {
    expectTypeOf<SettableCustomFieldType>().not.toEqualTypeOf<never>();
    expectTypeOf<"automatic_progress">().not.toExtend<SettableCustomFieldType>();
    const auto: CustomFieldValueInput = {
      // @ts-expect-error automatic_progress is read-only
      type: "automatic_progress",
      value: 1,
    };
    // @ts-expect-error a bare object is not a value input
    const empty: CustomFieldValueInput = {};
    void [auto, empty];
  });

  it("is used by SetCustomFieldValueParams with optional query fields", () => {
    const params: SetCustomFieldValueParams = {
      type: "number",
      value: 1,
      custom_task_ids: true,
      team_id: 1,
    };
    // @ts-expect-error type/value mismatch is also rejected here
    const bad: SetCustomFieldValueParams = { type: "number", value: "1" };
    void [params, bad];
  });
});

describe("cf filter builders", () => {
  it("returns CustomFieldFilter-compatible values", () => {
    expectTypeOf(cf.eq("f", "x")).toExtend<CustomFieldFilter>();
    expectTypeOf(cf.lt("f", 1)).toExtend<CustomFieldFilter>();
    expectTypeOf(cf.isNull("f")).toExtend<CustomFieldFilter>();
    expectTypeOf(cf.range("f", 1, 2)).toExtend<CustomFieldFilter>();
    expectTypeOf(
      cf.range("f", { low_value: 1, high_value: 2 }),
    ).toExtend<CustomFieldFilter>();
    expectTypeOf(cf.any("f", ["a"])).toExtend<CustomFieldFilter>();
  });

  it("rejects strings for numeric operators", () => {
    // @ts-expect-error lt takes a number
    cf.lt("f", "1");
    // @ts-expect-error lte takes a number
    cf.lte("f", "1");
    // @ts-expect-error gt takes a number
    cf.gt("f", "1");
    // @ts-expect-error gte takes a number
    cf.gte("f", "1");
    // @ts-expect-error range takes numbers
    cf.range("f", "1", "2");
    // @ts-expect-error range object takes numbers
    cf.range("f", { low_value: "1", high_value: "2" });
  });

  it("rejects non-arrays for list operators", () => {
    // @ts-expect-error any takes an array
    cf.any("f", "a");
    // @ts-expect-error all takes an array
    cf.all("f", "a");
    // @ts-expect-error notAny takes an array
    cf.notAny("f", "a");
    // @ts-expect-error notAll takes an array
    cf.notAll("f", "a");
  });

  it("does not let callers supply a value to isNull/isNotNull", () => {
    // @ts-expect-error isNull takes only a field id
    cf.isNull("f", null);
    // @ts-expect-error isNotNull takes only a field id
    cf.isNotNull("f", null);
  });

  it("rejects mismatched operator/value pairs in CustomFieldFilter", () => {
    // @ts-expect-error "<" needs a number
    const lt: CustomFieldFilter = { field_id: "f", operator: "<", value: "1" };
    // @ts-expect-error "ANY" needs a string array
    const any: CustomFieldFilter = {
      field_id: "f",
      operator: "ANY",
      value: "a",
    };
    const unknown: CustomFieldFilter = {
      field_id: "f",
      // @ts-expect-error unknown operator
      operator: "~",
      value: 1,
    };
    void [lt, any, unknown];
  });
});

describe("task params", () => {
  it("allows omitting custom_fields on query params", () => {
    const filtered: GetFilteredTeamTasksParams = {};
    const single: GetTaskParams = { task_id: "t" } as GetTaskParams;
    expectTypeOf<GetFilteredTeamTasksParams["custom_fields"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<GetTaskParams["custom_fields"]>().toEqualTypeOf<
      string | undefined
    >();
    void [filtered, single];
  });

  it("has no custom_fields on UpdateTaskParams", () => {
    expectTypeOf<UpdateTaskParams>().not.toHaveProperty("custom_fields");
  });
});
