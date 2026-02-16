// List structure
type List = {
  id: string;
  name: string;
  orderindex: number;
  content: string;
  status: {
    status: string;
    color: string;
    hide_label: boolean;
  } | null;
  priority: {
    priority: string;
    color: string;
  } | null;
  assignee: {
    id: number;
    username: string;
    color: string;
    email: string;
    profilePicture: string;
  } | null;
  task_count: number;
  due_date: string | null;
  start_date: string | null;
  folder: {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  };
  space: {
    id: string;
    name: string;
    access: boolean;
  };
  archived: boolean;
  override_statuses: boolean;
  statuses: {
    id: string;
    status: string;
    orderindex: number;
    color: string;
    type: string;
  }[];
  permission_level: string;
};

// Get lists
export type GetListsParams = {
  archived?: boolean;
};

export type GetListsResponse = {
  lists: List[];
};

// Get folderless lists
export type GetFolderlessListsParams = {
  archived?: boolean;
};

export type GetFolderlessListsResponse = {
  lists: List[];
};

// Get list
export type GetListResponse = List;

// Create list
export type CreateListParams = {
  name: string;
  content?: string;
  due_date?: number;
  due_date_time?: boolean;
  priority?: number;
  assignee?: number;
  status?: string;
};

export type CreateListResponse = List;

// Create folderless list
export type CreateFolderlessListParams = {
  name: string;
  content?: string;
  due_date?: number;
  due_date_time?: boolean;
  priority?: number;
  assignee?: number;
  status?: string;
};

export type CreateFolderlessListResponse = List;

// Update list
export type UpdateListParams = {
  name?: string;
  content?: string;
  due_date?: number;
  due_date_time?: boolean;
  priority?: number;
  assignee?: number;
  unset_status?: boolean;
};

export type UpdateListResponse = List;
