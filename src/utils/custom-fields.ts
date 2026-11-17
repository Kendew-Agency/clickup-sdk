import type {
  CustomField,
  CustomFieldFilter,
  CustomFieldValueInput,
  FilterScalar,
  RangeObject,
} from "../types";

/**
 * The request body for setting a custom field value. It never contains `type`.
 */
export type CustomFieldBody = {
  value: unknown;
  value_options?: { time?: boolean };
};

/**
 * Converts a custom field value input into the request body. Drops `type` and
 * includes `value_options` only when present.
 * @param input As the typed custom field value input
 * @returns The body to send to the ClickUp API
 * @example
 * ```ts
 * const body = toCustomFieldBody({ type: "number", value: 5 });
 * // { value: 5 }
 * ```
 */
export const toCustomFieldBody = (
  input: CustomFieldValueInput,
): CustomFieldBody => {
  const body: CustomFieldBody = { value: input.value };
  if ("value_options" in input && input.value_options !== undefined) {
    body.value_options = input.value_options;
  }
  return body;
};

/**
 * Finds a custom field on a task by its id.
 * @param customFields As the custom fields from a task
 * @param fieldId As the id of the custom field
 * @returns The matching custom field, or `undefined` when the task has no
 * custom field with that id
 * @example
 * ```ts
 * const field = retrieveCustomFieldValue(task.custom_fields, "field-id");
 * console.log(field?.value);
 * ```
 */
export const retrieveCustomFieldValue = (
  customFields: CustomField[],
  fieldId: string,
) => {
  const field = customFields.find((f) => f.id === fieldId);
  return field;
};

/**
 * The `value` sent with the `IS NULL` and `IS NOT NULL` operators. The ClickUp
 * docs do not specify it, so it lives in one place.
 */
export const NULL_OPERATOR_VALUE = null;

function range(field_id: string, low: number, high: number): CustomFieldFilter;
function range(field_id: string, value: RangeObject): CustomFieldFilter;
function range(
  field_id: string,
  lowOrValue: number | RangeObject,
  high?: number,
): CustomFieldFilter {
  if (typeof lowOrValue === "object") {
    return { field_id, operator: "RANGE", value: lowOrValue };
  }
  return {
    field_id,
    operator: "RANGE",
    value: [lowOrValue, high as number],
  };
}

/**
 * Builders for the `custom_fields` task filter. Each function returns a typed
 * filter for one operator, so the value shape always matches the operator.
 * @see https://developer.clickup.com/docs/taskfilters#operators
 * @example
 * ```ts
 * const filters = [cf.eq("abc-123", "test"), cf.range("def-456", 1, 10)];
 * const custom_fields = serializeCustomFieldFilters(filters);
 * ```
 */
export const cf = {
  /**
   * Matches with `=`. For text custom fields this is a fuzzy match: it
   * matches values that contain the given text. Use {@link cf.exact} for an
   * exact match.
   * @param field_id As the id of the custom field
   * @param value As the value to compare with
   */
  eq: (field_id: string, value: FilterScalar) =>
    ({ field_id, operator: "=", value }) as const,
  /**
   * Matches with `==`. This is an exact match, unlike the fuzzy
   * {@link cf.eq}.
   * @param field_id As the id of the custom field
   * @param value As the exact text to match
   */
  exact: (field_id: string, value: string) =>
    ({ field_id, operator: "==", value }) as const,
  /** Matches values less than `value` (`<`). */
  lt: (field_id: string, value: number) =>
    ({ field_id, operator: "<", value }) as const,
  /** Matches values less than or equal to `value` (`<=`). */
  lte: (field_id: string, value: number) =>
    ({ field_id, operator: "<=", value }) as const,
  /** Matches values greater than `value` (`>`). */
  gt: (field_id: string, value: number) =>
    ({ field_id, operator: ">", value }) as const,
  /** Matches values greater than or equal to `value` (`>=`). */
  gte: (field_id: string, value: number) =>
    ({ field_id, operator: ">=", value }) as const,
  /**
   * Matches with `!=`. The ClickUp docs describe it as "not equal to" and, for
   * text custom fields, as "does not contain", so it is the fuzzy negation of
   * {@link cf.eq}. Use {@link cf.notExact} to exclude an exact match.
   * @param field_id As the id of the custom field
   * @param value As the value to exclude
   */
  neq: (field_id: string, value: FilterScalar) =>
    ({ field_id, operator: "!=", value }) as const,
  /**
   * Matches with `!==`. This is the exact negation of {@link cf.exact}: it
   * excludes only values that equal the given text.
   * @param field_id As the id of the custom field
   * @param value As the exact text to exclude
   */
  notExact: (field_id: string, value: string) =>
    ({ field_id, operator: "!==", value }) as const,
  /** Matches tasks where the custom field is not set (`IS NULL`). */
  isNull: (field_id: string) =>
    ({
      field_id,
      operator: "IS NULL",
      value: NULL_OPERATOR_VALUE,
    }) as const,
  /** Matches tasks where the custom field is set (`IS NOT NULL`). */
  isNotNull: (field_id: string) =>
    ({
      field_id,
      operator: "IS NOT NULL",
      value: NULL_OPERATOR_VALUE,
    }) as const,
  /**
   * Matches values between a low and high bound (`RANGE`). Accepts either
   * `(field_id, low, high)` or `(field_id, { low_value, high_value })`.
   * @see https://developer.clickup.com/docs/range
   */
  range,
  /** Matches when the field contains any of the given ids (`ANY`). */
  any: (field_id: string, value: string[]) =>
    ({ field_id, operator: "ANY", value }) as const,
  /** Matches when the field contains all of the given ids (`ALL`). */
  all: (field_id: string, value: string[]) =>
    ({ field_id, operator: "ALL", value }) as const,
  /** Matches when the field contains none of the given ids (`NOT ANY`). */
  notAny: (field_id: string, value: string[]) =>
    ({ field_id, operator: "NOT ANY", value }) as const,
  /** Matches when the field does not contain all given ids (`NOT ALL`). */
  notAll: (field_id: string, value: string[]) =>
    ({ field_id, operator: "NOT ALL", value }) as const,
};

/**
 * Serializes filters into the value for the `custom_fields` query param.
 * @param filters As the filters, usually built with {@link cf}
 * @returns A JSON array string where each item has `field_id`, `operator` and
 * `value`. An empty array gives `"[]"`.
 * @see https://developer.clickup.com/docs/taskfilters#operators
 * @example
 * ```ts
 * const custom_fields = serializeCustomFieldFilters([cf.eq("abc-123", "test")]);
 * ```
 */
export const serializeCustomFieldFilters = (
  filters: CustomFieldFilter[],
): string =>
  JSON.stringify(
    filters.map(({ field_id, operator, value }) => ({
      field_id,
      operator,
      value,
    })),
  );
