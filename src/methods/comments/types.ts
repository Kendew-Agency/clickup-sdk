import type {
  PaginationParams,
  ReferenceByCustomTaskId,
  User,
} from "../../types/clickup.types";

// Comment element and attribute types

export type CommentTextAttributes = {
  bold?: true;
  italic?: true;
  code?: true;
  link?: string;
  [key: string]: unknown;
};

export type CommentBlockAttributes = {
  "code-block"?: { "code-block": string };
  list?: {
    list: "bullet" | "ordered" | "unchecked" | "checked" | "toggled" | "none";
  };
  indent?: number;
  [key: string]: unknown;
};

export type CommentTextElement = {
  text: string;
  type?: string;
  attributes?: CommentTextAttributes | CommentBlockAttributes;
};

export type CommentEmoticonElement = {
  text: string;
  type: "emoticon";
  emoticon: { code: string };
};

export type CommentTagElement = {
  type: "tag";
  user: { id: number };
};

export type CommentGenericElement = {
  [key: string]: unknown;
};

export type CommentElement =
  | CommentTextElement
  | CommentEmoticonElement
  | CommentTagElement
  | CommentGenericElement;

// Generics
type CommentUser = Exclude<
  User,
  "week_start_day" | "global_font_support" | "timezone"
>;

type Comment = {
  id: string;
  comment: CommentElement[];
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

// Comment content XOR: either comment_text or comment array, not both
export type CommentContent =
  | { comment_text: string; comment?: never }
  | { comment: CommentElement[]; comment_text?: never };

// Create task comment
export type CreateTaskCommentParams = CreateTaskCommentParamsBase &
  ReferenceByCustomTaskId;

export type CreateTaskCommentBody = CommentContent & {
  assignee?: number;
  group_assignee?: string;
  notify_all: boolean;
};

type CreateTaskCommentParamsBase = CommentContent & {
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

type CreateChatViewCommentParamsBase = CommentContent & {
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

type CreateListCommentParamsBase = CommentContent & {
  assignee?: number;
  notify_all: boolean;
};

export type CreateListCommentResponse = CommentResponse;

// Update comment
// Both comment_text and comment are optional (update may only change assignee/resolved),
// but they are mutually exclusive at the type level.
export type UpdateCommentContent =
  | { comment_text?: string; comment?: never }
  | { comment?: CommentElement[]; comment_text?: never };

export type UpdateCommentParams = UpdateCommentContent & {
  assignee?: number;
  group_assignee?: number;
  resolved?: boolean;
};

// Get threaded comments
export type GetThreadedCommentsResponse = {
  comments: Comment[];
};
