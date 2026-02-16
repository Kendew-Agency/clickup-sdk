// Custom Field Types
type CustomFieldType =
  | "drop_down"
  | "email"
  | "phone"
  | "date"
  | "short_text"
  | "long_text"
  | "number"
  | "currency"
  | "emoji"
  | "url"
  | "checkbox"
  | "automatic_progress"
  | "manual_progress"
  | "location"
  | "labels"
  | "relationship"
  | "users";

// Type Config Structures
type DropdownOption = {
  id: string;
  name: string;
  color: string;
  orderindex: string;
};

type DropdownTypeConfig = {
  sorting: "manual" | "name_asc" | "name_desc";
  default: number;
  placeholder: string;
  options: DropdownOption[];
};

type CurrencyTypeConfig = {
  currency_type: string;
  default: number;
  precision: number;
};

type EmojiTypeConfig = {
  code_point: string;
  count: number;
};

type LabelsOption = {
  id: string;
  label: string;
  color: string;
  orderindex: string;
};

type LabelsTypeConfig = {
  sorting: "manual" | "name_asc" | "name_desc";
  options: LabelsOption[];
};

type ProgressTypeConfig = {
  start: number;
  end: number;
  current: number;
};

type TypeConfig =
  | DropdownTypeConfig
  | CurrencyTypeConfig
  | EmojiTypeConfig
  | LabelsTypeConfig
  | ProgressTypeConfig
  | Record<string, unknown>;

// Base Custom Field
type CustomField = {
  id: string;
  name: string;
  type: CustomFieldType;
  type_config: TypeConfig;
  date_created: string;
  hide_from_guests: boolean;
  required: boolean;
};

// Response Types
export type GetListCustomFieldsResponse = {
  fields: CustomField[];
};

export type GetSpaceCustomFieldsResponse = {
  fields: CustomField[];
};

export type GetWorkspaceCustomFieldsResponse = {
  fields: CustomField[];
};
