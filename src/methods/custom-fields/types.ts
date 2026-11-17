import type { FilterOperatorOptions } from "../../types/clickup.types";
import type { NULL_OPERATOR_VALUE } from "../../utils/custom-fields";

// Custom Field Types
export type CustomFieldType =
  | "url"
  | "drop_down"
  | "labels"
  | "email"
  | "phone"
  | "date"
  | "short_text"
  | "text"
  | "long_text"
  | "checkbox"
  | "number"
  | "currency"
  | "tasks"
  | "relationship"
  | "users"
  | "emoji"
  | "automatic_progress"
  | "manual_progress"
  | "location";

/**
 * Ids to add and remove, used by `users`, `tasks` and `relationship` fields.
 */
export type AddRemoveValue = {
  add?: string[];
  rem?: string[];
};

/**
 * A custom field value paired with its field type. The `type` selects the
 * value shape that the ClickUp API accepts. `automatic_progress` is read-only
 * and therefore not part of this union.
 */
export type CustomFieldValueInput =
  /** A valid URL string. */
  | { type: "url"; value: string }
  /** The id of one of the options in the field's `type_config.options`. */
  | { type: "drop_down"; value: string }
  /** Option ids from `type_config.options`. Replaces all labels on the task. */
  | { type: "labels"; value: string[] }
  /** A valid email address. */
  | { type: "email"; value: string }
  /** A valid phone number including country code. */
  | { type: "phone"; value: string }
  /**
   * Unix time in milliseconds. Only the date shows in ClickUp unless
   * `value_options.time` is `true`.
   */
  | { type: "date"; value: number; value_options?: { time?: boolean } }
  /** A single line of plain text. */
  | { type: "short_text"; value: string }
  /** A paragraph of plain text. */
  | { type: "text"; value: string }
  /**
   * A paragraph of plain text.
   * @deprecated Use `text` instead.
   */
  | { type: "long_text"; value: string }
  /** A boolean. */
  | { type: "checkbox"; value: boolean }
  /** A number. */
  | { type: "number"; value: number }
  /** A number (amount of money, in the field's currency). */
  | { type: "currency"; value: number }
  /** Task ids to add and remove. The user needs access to every task. */
  | { type: "tasks"; value: AddRemoveValue }
  /** Task ids to add and remove. */
  | { type: "relationship"; value: AddRemoveValue }
  /** User ids to add and remove. */
  | { type: "users"; value: AddRemoveValue }
  /** An integer from 0 to the field's `type_config.count` (maximum 5). */
  | { type: "emoji"; value: number }
  /** The current progress, as an absolute value between `start` and `end`. */
  | { type: "manual_progress"; value: { current: number } }
  /** Latitude, longitude and formatted address (Google Maps Geocoding). */
  | {
      type: "location";
      value: {
        location: { lat: number; lng: number };
        formatted_address: string;
      };
    };

export type SettableCustomFieldType = CustomFieldValueInput["type"];

/**
 * A scalar value that can be compared in a `custom_fields` filter.
 */
export type FilterScalar = string | number | boolean;

/**
 * The object form of the value of a `RANGE` filter.
 * @see https://developer.clickup.com/docs/range
 */
export type RangeObject = { low_value: number; high_value: number };

type CustomFieldFilterBase = { field_id: string };

/**
 * A filter for the `custom_fields` query param, keyed by `operator`. The
 * `operator` selects the value shape that the ClickUp API accepts.
 * @see https://developer.clickup.com/docs/taskfilters#operators
 */
export type CustomFieldFilter =
  /** Equality and inequality on a scalar. */
  | (CustomFieldFilterBase & {
      operator: Extract<FilterOperatorOptions, "=" | "==" | "!=" | "!==">;
      value: FilterScalar;
    })
  /** Numeric comparison. */
  | (CustomFieldFilterBase & {
      operator: Extract<FilterOperatorOptions, "<" | "<=" | ">" | ">=">;
      value: number;
    })
  /** Field is not set or is set. The value is fixed and cannot be supplied. */
  | (CustomFieldFilterBase & {
      operator: Extract<FilterOperatorOptions, "IS NULL" | "IS NOT NULL">;
      value: typeof NULL_OPERATOR_VALUE;
    })
  /** Value between a low and high bound, as a tuple or a `RangeObject`. */
  | (CustomFieldFilterBase & {
      operator: Extract<FilterOperatorOptions, "RANGE">;
      value: [number, number] | RangeObject;
    })
  /** Membership on a list of ids. */
  | (CustomFieldFilterBase & {
      operator: Extract<
        FilterOperatorOptions,
        "ANY" | "ALL" | "NOT ANY" | "NOT ALL"
      >;
      value: string[];
    });

// Type Config Structures
export type DropdownOption = {
  id: string;
  name: string;
  color: string;
  orderindex: string;
};

export type DropdownTypeConfig = {
  sorting: "manual" | "name_asc" | "name_desc";
  default: number;
  placeholder: string;
  options: DropdownOption[];
};

export type CurrencyTypeConfig = {
  currency_type: string;
  default: number;
  precision: number;
};

export type EmojiTypeConfig = {
  code_point: string;
  count: number;
};

export type LabelsOption = {
  id: string;
  label: string;
  color: string;
  orderindex: string;
};

export type LabelsTypeConfig = {
  sorting: "manual" | "name_asc" | "name_desc";
  options: LabelsOption[];
};

export type ProgressTypeConfig = {
  start: number;
  end: number;
  current: number;
};

export type TypeConfig =
  | DropdownTypeConfig
  | CurrencyTypeConfig
  | EmojiTypeConfig
  | LabelsTypeConfig
  | ProgressTypeConfig
  | Record<string, unknown>;

// Base Custom Field
export type CustomField = {
  id: string;
  name: string;
  type: CustomFieldType;
  type_config: TypeConfig;
  date_created: string;
  hide_from_guests: boolean;
  required: boolean;
};

// Set Custom Field value
export type SetCustomFieldValueParams = {
  custom_task_ids?: boolean;
  team_id?: number;
} & CustomFieldValueInput;

export type RemoveCustomFieldValueParams = {
  custom_task_ids?: boolean;
  team_id?: number;
};

// Response Types
export type GetListCustomFieldsResponse = {
  fields: CustomField[];
};

export type GetFolderCustomFieldsResponse = {
  fields: CustomField[];
};

export type GetSpaceCustomFieldsResponse = {
  fields: CustomField[];
};

export type GetWorkspaceCustomFieldsResponse = {
  fields: CustomField[];
};
