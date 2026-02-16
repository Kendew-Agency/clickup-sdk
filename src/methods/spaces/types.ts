// Space Features (ClickApps)
type SpaceFeatures = {
  due_dates?: {
    enabled: boolean;
    start_date: boolean;
    remap_due_dates: boolean;
    remap_closed_due_date: boolean;
  };
  time_tracking?: {
    enabled: boolean;
  };
  tags?: {
    enabled: boolean;
  };
  time_estimates?: {
    enabled: boolean;
  };
  checklists?: {
    enabled: boolean;
  };
  custom_fields?: {
    enabled: boolean;
  };
  remap_dependencies?: {
    enabled: boolean;
  };
  dependency_warning?: {
    enabled: boolean;
  };
  portfolios?: {
    enabled: boolean;
  };
};

// Space structure
type Space = {
  id: string;
  name: string;
  private: boolean;
  statuses: {
    id: string;
    status: string;
    type: string;
    orderindex: number;
    color: string;
  }[];
  multiple_assignees: boolean;
  features: SpaceFeatures;
  archived: boolean;
};

// Get spaces
export type GetSpacesParams = {
  archived?: boolean;
};

export type GetSpacesResponse = {
  spaces: Space[];
};

// Get space
export type GetSpaceResponse = Space;

// Create space
export type CreateSpaceParams = {
  name: string;
  multiple_assignees?: boolean;
  features?: SpaceFeatures;
};

export type CreateSpaceResponse = Space;

// Update space
export type UpdateSpaceParams = {
  name?: string;
  color?: string;
  private?: boolean;
  admin_can_manage?: boolean;
  multiple_assignees?: boolean;
  features?: SpaceFeatures;
};

export type UpdateSpaceResponse = Space;
