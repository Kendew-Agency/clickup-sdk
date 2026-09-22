// Tag structure
type Tag = {
  name: string;
  tag_fg: string;
  tag_bg: string;
  creator: number;
};

// Get space tags
export type GetSpaceTagsResponse = {
  tags: Tag[];
};

// Create space tag
export type CreateSpaceTagParams = {
  tag: {
    name: string;
    tag_fg?: string;
    tag_bg?: string;
  };
};

export type CreateSpaceTagResponse = Tag;

// Update space tag
export type UpdateSpaceTagParams = {
  tag: {
    name: string;
    tag_fg?: string;
    tag_bg?: string;
  };
};

export type UpdateSpaceTagResponse = Tag;

// Add tag to task
export type AddTagToTaskParams = {
  custom_task_ids?: boolean;
  team_id?: number;
};

// Remove tag from task
export type RemoveTagFromTaskParams = {
  custom_task_ids?: boolean;
  team_id?: number;
};
