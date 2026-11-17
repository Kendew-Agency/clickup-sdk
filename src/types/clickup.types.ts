/**
 * The user as it is stored in ClickUp
 */
export type User = {
  id: string;
  username: string;
  email: string;
  color: string;
  profilePicture: string | null;
  initials: string;
  week_start_day: number;
  global_font_support: boolean;
  timezone: string;
};

/**
 * The query param for reference by custom task id
 */
export type ReferenceByCustomTaskId =
  | {
      custom_task_ids: true;
      team_id: number;
    }
  | {
      custom_task_ids?: false;
      team_id?: number;
    };

/**
 * The query params for pagination
 */
export type PaginationParams =
  | {
      start: number;
      start_id: string;
    }
  | {
      start?: never;
      start_id?: never;
    };

/**
 * The exact set of operators that the `custom_fields` filter supports.
 * @see https://developer.clickup.com/docs/taskfilters#operators
 */
export type FilterOperatorOptions =
  | "="
  | "=="
  | "<"
  | "<="
  | ">"
  | ">="
  | "!="
  | "!=="
  | "IS NULL"
  | "IS NOT NULL"
  | "RANGE"
  | "ANY"
  | "ALL"
  | "NOT ANY"
  | "NOT ALL";
