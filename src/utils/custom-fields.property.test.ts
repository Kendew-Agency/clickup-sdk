import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  cf,
  NULL_OPERATOR_VALUE,
  serializeCustomFieldFilters,
} from "./custom-fields.js";

const NUM_RUNS = 100;

const fieldId = fc.string();
const scalar = fc.oneof(fc.string(), fc.double({ noNaN: true }), fc.boolean());
const num = fc.double({ noNaN: true });
const ids = fc.array(fc.string());

describe("cf filter builders", () => {
  // Feature: custom-fields-type-safety, Property 3: Filter builders preserve operator and value
  // **Validates: Requirements 4.2, 4.4, 4.5, 6.6**
  it("Property 3: scalar builders preserve field_id, operator and value", () => {
    fc.assert(
      fc.property(fieldId, scalar, fc.string(), num, (id, s, text, n) => {
        expect(cf.eq(id, s)).toEqual({ field_id: id, operator: "=", value: s });
        expect(cf.neq(id, s)).toEqual({
          field_id: id,
          operator: "!=",
          value: s,
        });
        expect(cf.exact(id, text)).toEqual({
          field_id: id,
          operator: "==",
          value: text,
        });
        expect(cf.notExact(id, text)).toEqual({
          field_id: id,
          operator: "!==",
          value: text,
        });
        expect(cf.lt(id, n)).toEqual({ field_id: id, operator: "<", value: n });
        expect(cf.lte(id, n)).toEqual({
          field_id: id,
          operator: "<=",
          value: n,
        });
        expect(cf.gt(id, n)).toEqual({ field_id: id, operator: ">", value: n });
        expect(cf.gte(id, n)).toEqual({
          field_id: id,
          operator: ">=",
          value: n,
        });
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Feature: custom-fields-type-safety, Property 3: Filter builders preserve operator and value
  // **Validates: Requirements 4.2, 4.4, 4.5, 6.6**
  it("Property 3: array builders preserve the id array", () => {
    fc.assert(
      fc.property(fieldId, ids, (id, value) => {
        expect(cf.any(id, value)).toEqual({
          field_id: id,
          operator: "ANY",
          value,
        });
        expect(cf.all(id, value)).toEqual({
          field_id: id,
          operator: "ALL",
          value,
        });
        expect(cf.notAny(id, value)).toEqual({
          field_id: id,
          operator: "NOT ANY",
          value,
        });
        expect(cf.notAll(id, value)).toEqual({
          field_id: id,
          operator: "NOT ALL",
          value,
        });
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Feature: custom-fields-type-safety, Property 3: Filter builders preserve operator and value
  // **Validates: Requirements 4.2, 4.4, 4.5, 6.6**
  it("Property 3: both range overloads preserve their bounds", () => {
    fc.assert(
      fc.property(fieldId, num, num, (id, low, high) => {
        expect(cf.range(id, low, high)).toEqual({
          field_id: id,
          operator: "RANGE",
          value: [low, high],
        });
        const value = { low_value: low, high_value: high };
        expect(cf.range(id, value)).toEqual({
          field_id: id,
          operator: "RANGE",
          value,
        });
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Feature: custom-fields-type-safety, Property 3: Filter builders preserve operator and value
  // **Validates: Requirements 4.2, 4.4, 4.5, 6.6**
  it("Property 3: null operators use NULL_OPERATOR_VALUE", () => {
    fc.assert(
      fc.property(fieldId, (id) => {
        expect(cf.isNull(id)).toEqual({
          field_id: id,
          operator: "IS NULL",
          value: NULL_OPERATOR_VALUE,
        });
        expect(cf.isNotNull(id)).toEqual({
          field_id: id,
          operator: "IS NOT NULL",
          value: NULL_OPERATOR_VALUE,
        });
      }),
      { numRuns: NUM_RUNS },
    );
  });
});

describe("serializeCustomFieldFilters", () => {
  // JSON cannot carry NaN, Infinity or -0, so numbers are limited to finite non-negative-zero values.
  const jsonNum = fc
    .double({ noNaN: true, noDefaultInfinity: true })
    .map((n) => (Object.is(n, -0) ? 0 : n));
  const jsonScalar = fc.oneof(fc.string(), jsonNum, fc.boolean());

  const filter = fc.oneof(
    fc.tuple(fieldId, jsonScalar).map(([id, v]) => cf.eq(id, v)),
    fc.tuple(fieldId, jsonScalar).map(([id, v]) => cf.neq(id, v)),
    fc.tuple(fieldId, fc.string()).map(([id, v]) => cf.exact(id, v)),
    fc.tuple(fieldId, fc.string()).map(([id, v]) => cf.notExact(id, v)),
    fc.tuple(fieldId, jsonNum).map(([id, v]) => cf.lt(id, v)),
    fc.tuple(fieldId, jsonNum).map(([id, v]) => cf.lte(id, v)),
    fc.tuple(fieldId, jsonNum).map(([id, v]) => cf.gt(id, v)),
    fc.tuple(fieldId, jsonNum).map(([id, v]) => cf.gte(id, v)),
    fc.tuple(fieldId, jsonNum, jsonNum).map(([id, a, b]) => cf.range(id, a, b)),
    fc
      .tuple(fieldId, jsonNum, jsonNum)
      .map(([id, a, b]) => cf.range(id, { low_value: a, high_value: b })),
    fc.tuple(fieldId, ids).map(([id, v]) => cf.any(id, v)),
    fc.tuple(fieldId, ids).map(([id, v]) => cf.all(id, v)),
    fc.tuple(fieldId, ids).map(([id, v]) => cf.notAny(id, v)),
    fc.tuple(fieldId, ids).map(([id, v]) => cf.notAll(id, v)),
    fieldId.map((id) => cf.isNull(id)),
    fieldId.map((id) => cf.isNotNull(id)),
  );

  // Feature: custom-fields-type-safety, Property 4: Serializer round trip
  // **Validates: Requirements 5.2, 5.3, 5.4**
  it("Property 4: JSON.parse of the output deep-equals the input with exact keys", () => {
    fc.assert(
      fc.property(fc.array(filter), (filters) => {
        const parsed = JSON.parse(serializeCustomFieldFilters(filters));
        expect(parsed).toEqual(filters);
        for (const element of parsed) {
          expect(Object.keys(element).sort()).toEqual([
            "field_id",
            "operator",
            "value",
          ]);
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Feature: custom-fields-type-safety, Property 4: Serializer round trip
  // **Validates: Requirements 5.2, 5.3, 5.4**
  it("Property 4: the empty array serializes to []", () => {
    expect(serializeCustomFieldFilters([])).toBe("[]");
  });
});
