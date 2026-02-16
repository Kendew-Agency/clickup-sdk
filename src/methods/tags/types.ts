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
