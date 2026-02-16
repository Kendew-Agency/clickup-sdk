// Folder structure
type Folder = {
  id: string;
  name: string;
  orderindex: number;
  override_statuses: boolean;
  hidden: boolean;
  space: {
    id: string;
    name: string;
    access: boolean;
  };
  task_count: string;
  archived: boolean;
  statuses: {
    id: string;
    status: string;
    orderindex: number;
    color: string;
    type: string;
  }[];
  lists: {
    id: string;
    name: string;
    orderindex: number;
    status: string | null;
    priority: string | null;
    assignee: string | null;
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
  }[];
  permission_level: string;
};

// Get folders
export type GetFoldersParams = {
  archived?: boolean;
};

export type GetFoldersResponse = {
  folders: Folder[];
};

// Get folder
export type GetFolderResponse = Folder;

// Create folder
export type CreateFolderParams = {
  name: string;
};

export type CreateFolderResponse = Folder;

// Update folder
export type UpdateFolderParams = {
  name: string;
};

export type UpdateFolderResponse = Folder;
