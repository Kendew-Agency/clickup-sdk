import type { ReferenceByCustomTaskId, User } from "../../types/clickup.types";

// Task User (simplified)
type TaskUser = Pick<
  User,
  "id" | "username" | "email" | "color" | "profilePicture"
>;

// Task structure
export type Task = {
  id: string;
  custom_id: string | null;
  custom_item_id: number | null;
  name: string;
  text_content: string;
  description: string;
  status: {
    id: string;
    status: string;
    color: string;
    orderindex: number;
    type: string;
  };
  orderindex: string;
  date_created: string;
  date_updated: string;
  date_closed: string | null;
  date_done: string | null;
  archived: boolean;
  creator: TaskUser;
  assignees: TaskUser[];
  watchers: TaskUser[];
  checklists: unknown[];
  tags: {
    name: string;
    tag_fg: string;
    tag_bg: string;
    creator: number;
  }[];
  parent: string | null;
  priority: {
    id: string;
    priority: string;
    color: string;
    orderindex: string;
  } | null;
  due_date: string | null;
  start_date: string | null;
  points: number | null;
  time_estimate: number | null;
  time_spent: number | null;
  custom_fields: unknown[];
  dependencies: unknown[];
  linked_tasks: unknown[];
  team_id: string;
  url: string;
  sharing: {
    public: boolean;
    public_share_expires_on: string | null;
    public_fields: string[];
    token: string | null;
    seo_optimized: boolean;
  };
  permission_level: string;
  list: {
    id: string;
    name: string;
    access: boolean;
  };
  project: {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  };
  folder: {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  };
  space: {
    id: string;
  };
};

// Get tasks
export type GetTasksParams = {
  archived?: boolean;
  include_markdown_description?: boolean;
  page?: number;
  order_by?: string;
  reverse?: boolean;
  subtasks?: boolean;
  statuses?: string[];
  include_closed?: boolean;
  include_timl?: boolean;
  assignees?: number[];
  tags?: string[];
  due_date_gt?: number;
  due_date_lt?: number;
  date_created_gt?: number;
  date_created_lt?: number;
  date_updated_gt?: number;
  date_updated_lt?: number;
  date_done_gt?: number;
   date_done_lt?: number;
  custom_fields?: string;
  custom_field?: string;
  custom_items?: number[];
};

export type GetTasksResponse = {
  tasks: Task[];
  last_page: boolean;
};

// Get task
export type GetTaskParams = ReferenceByCustomTaskId & {
  custom_task_ids?: boolean;
  team_id?: number;
  include_subtasks?: boolean;
  include_markdown_description?: boolean;
  custom_fields: string;

};

export type GetTaskResponse = Task;

// Create task
export type CreateTaskParams = {
  name: string;
  description?: string;
  assignees?: number[];
  archived?: boolean;
  group_assignees?: string[];
  tags?: string[];
  status?: string;
  priority?: number;
  due_date?: number;
  due_date_time?: boolean;
  time_estimate?: number;
  start_date?: number;
  start_date_time?: boolean;
  points?: number;
  notify_all?: boolean;
  parent?: string;
  links_to?: string;
  check_required_custom_fields?: boolean;
  markdown_content?: string;
  custom_fields?: {
    id: string;
    value: string | number | boolean | null;
  }[];
  custom_item_id?: number;
};

export type CreateTaskResponse = Task;

// Update task
export type UpdateTaskParams = ReferenceByCustomTaskId & {
  custom_item_id?: number;
  name?: string;
  description?: string;
  markdown_content?: string;
  status?: string;
  priority?: number;
  due_date?: number;
  due_date_time?: boolean;
  parent?: string;
  time_estimate?: number;
  start_date?: number;
  start_date_time?: boolean;
  points?: number;
  assignees?: {
    add?: number[];
    rem?: number[];
  };
  group_assignees?: {
    add?: string[];
    rem?: string[];
  }
  watchers?:
    {
      add: number[];
      rem: number[];
    }
  archived?: boolean;
};

export type UpdateTaskResponse = Task;

// Add dependency
export type AddDependencyParams = ReferenceByCustomTaskId & {
  depends_on?: string;
  dependency_of?: string;
};

// Delete dependency
export type DeleteDependencyParams = ReferenceByCustomTaskId & {
  depends_on?: string;
  dependency_of?: string;
};

export type GetFilteredTeamTasksParams = {
  page?: number;
  order_by?: "id" | "created" | "updated" | "due_date";
  reverse?: boolean;
  subtasks?: boolean;
  space_ids?: string[];
  project_ids?: string[];
  list_ids?: string[];
  statuses?: string[];
  include_closed?: boolean;
  assignees?: string[];
  tags?: string[];
  due_date_gt?: number;
  due_date_lt?: number;
  date_created_gt?: number;
  date_created_lt?: number;
  date_updated_gt?: number;
  date_updated_lt?: number;
  date_done_gt?: number;
  date_done_lt?: number;
  custom_fields?: string[];
  parent?: string;
  include_markdown_description?: boolean;
  custom_items?: number[];
};

export type GetFilteredTeamTasksResponse = {
  tasks: Task[];
};

// Merge tasks
export type MergeTasksParams = {
  source_task_ids: string[];
};

// Time in status
export type GetTaskTimeInStatusParams = {
  custom_task_ids?: boolean;
  team_id?: number;
};

export type GetTaskTimeInStatusResponse = {
  current_status: {
    status: string;
    color: string;
    total_time: {
      by_minute: number;
      since: string;
    };
  };

  status_history: {
    status: string;
    color: string;
    type: string;
    total_time: {
      by_minute: number;
      since: string;
    };
    orderindex: number;
  }[];
};

// Get Bulk Tasks' Time in Status
export type GetBulkTasksTimeInStatusParams = {
  task_ids: string[];
  custom_task_ids?: boolean;
  team_id?: number;
};

export type GetBulkTasksTimeInStatusResponse = Record<
  string,
  GetTaskTimeInStatusResponse
>;

// Create Task From Template
export type CreateTaskFromTemplateParams = {
  name: string;
};

export type CreateTaskFromTemplateResponse = Record<string, unknown>;


// Add task link
export type AddTaskLinkParams = ReferenceByCustomTaskId & {
  links_to: string;
};

// Delete task link
export type DeleteTaskLinkParams = ReferenceByCustomTaskId & {
  links_to: string;
};
