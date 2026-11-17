import { describe, expect, it } from "vitest";
import {
  cf,
  NULL_OPERATOR_VALUE,
  serializeCustomFieldFilters,
} from "./custom-fields.js";

describe("cf", () => {
  const cases = [
    ["eq", cf.eq("f", "a"), "=", "a"],
    ["eq (number)", cf.eq("f", 3), "=", 3],
    ["exact", cf.exact("f", "a"), "==", "a"],
    ["lt", cf.lt("f", 1), "<", 1],
    ["lte", cf.lte("f", 1), "<=", 1],
    ["gt", cf.gt("f", 1), ">", 1],
    ["gte", cf.gte("f", 1), ">=", 1],
    ["neq", cf.neq("f", "a"), "!=", "a"],
    ["notExact", cf.notExact("f", "a"), "!==", "a"],
    ["any", cf.any("f", ["1", "2"]), "ANY", ["1", "2"]],
    ["all", cf.all("f", ["1", "2"]), "ALL", ["1", "2"]],
    ["notAny", cf.notAny("f", ["1"]), "NOT ANY", ["1"]],
    ["notAll", cf.notAll("f", ["1"]), "NOT ALL", ["1"]],
  ] as const;

  it.each(cases)("%s maps to its operator and value", (_n, filter, op, v) => {
    expect(filter).toEqual({ field_id: "f", operator: op, value: v });
  });

  it("isNull and isNotNull use NULL_OPERATOR_VALUE", () => {
    expect(cf.isNull("f")).toEqual({
      field_id: "f",
      operator: "IS NULL",
      value: NULL_OPERATOR_VALUE,
    });
    expect(cf.isNotNull("f")).toEqual({
      field_id: "f",
      operator: "IS NOT NULL",
      value: NULL_OPERATOR_VALUE,
    });
  });

  it("range accepts low and high numbers", () => {
    expect(cf.range("f", 1, 10)).toEqual({
      field_id: "f",
      operator: "RANGE",
      value: [1, 10],
    });
  });

  it("range accepts a range object", () => {
    const value = { low_value: 1, high_value: 10 };
    expect(cf.range("f", value)).toEqual({
      field_id: "f",
      operator: "RANGE",
      value,
    });
  });
});

describe("serializeCustomFieldFilters", () => {
  it("returns [] for no filters", () => {
    expect(serializeCustomFieldFilters([])).toBe("[]");
  });

  it("serializes filters with field_id, operator and value in order", () => {
    expect(
      serializeCustomFieldFilters([cf.eq("a", "x"), cf.range("b", 1, 2)]),
    ).toBe(
      '[{"field_id":"a","operator":"=","value":"x"},{"field_id":"b","operator":"RANGE","value":[1,2]}]',
    );
  });

  it("serializes null filters with a null value", () => {
    expect(JSON.parse(serializeCustomFieldFilters([cf.isNull("a")]))).toEqual([
      { field_id: "a", operator: "IS NULL", value: null },
    ]);
  });

  it("drops extra keys", () => {
    const filter = { ...cf.eq("a", 1), extra: true };
    expect(JSON.parse(serializeCustomFieldFilters([filter]))).toEqual([
      { field_id: "a", operator: "=", value: 1 },
    ]);
  });
});
