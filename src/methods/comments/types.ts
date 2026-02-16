import type {
  PaginationParams,
  ReferenceByCustomTaskId,
  User,
} from "../../types/clickup.types";

// Generics
type CommentUser = Exclude<
  User,
  "week_start_day" | "global_font_support" | "timezone"
>;

type Comment = {
  id: string;
  comment: {
    text: string;
    attributes?: Record<string, unknown>;
  }[];
  comment_text: string;
  user: CommentUser;
  resolved: boolean;
  assignee: CommentUser | null;
  assigned_by: CommentUser | null;
  reply_count: number;
  /**
   * The date is returned as a string but holds a unix timestamp.
   * In most cases this value is stored as a number
   */
  date: string;
};

type CommentResponse = {
  id: string;
  hist_id: string;
  date: number;
};

// Get task comments
export type GetTaskCommentsParams = ReferenceByCustomTaskId & PaginationParams;

export type GetTaskCommentsResponse = {
  comments: Comment[];
};

// Create task comment
export type CreateTaskCommentParams = CreateTaskCommentParamsBase &
  ReferenceByCustomTaskId;

export type CreateTaskCommentBody = Pick<
  CreateTaskCommentParams,
  "comment_text" | "assignee" | "group_assignee" | "notify_all"
>;

type CreateTaskCommentParamsBase = {
  comment_text: string;
  assignee?: number;
  group_assignee?: string;
  notify_all: boolean;
};

export type CreateTaskCommentResponse = CommentResponse;

// Get chat view comments
export type GetChatViewCommentsParams = PaginationParams;

export type GetChatViewCommentsResponse = {
  comments: Comment[];
};

// Create chat view comment
export type CreateChatViewCommentParams = CreateChatViewCommentParamsBase;

type CreateChatViewCommentParamsBase = {
  comment_text: string;
  notify_all: boolean;
};

export type CreateChatViewCommentResponse = CommentResponse;

// Get list comments
export type GetListCommentsParams = PaginationParams;

export type GetListCommentsResponse = {
  comments: Comment[];
};

// Create list comment
export type CreateListCommentParams = CreateListCommentParamsBase;

type CreateListCommentParamsBase = {
  comment_text: string;
  assignee?: number;
  notify_all: boolean;
};

export type CreateListCommentResponse = CommentResponse;

// Update comment
export type UpdateCommentParams = {
  comment_text: string;
  assignee: number;
  group_assignee: number;
  resolved: boolean;
};

// Get threaded comments
export type GetThreadedCommentsResponse = {
  comments: Comment[];
};
