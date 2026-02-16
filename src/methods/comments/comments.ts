import { Base } from "../base";
import type {
  CreateChatViewCommentParams,
  CreateChatViewCommentResponse,
  CreateListCommentParams,
  CreateListCommentResponse,
  CreateTaskCommentBody,
  CreateTaskCommentParams,
  CreateTaskCommentResponse,
  GetChatViewCommentsParams,
  GetChatViewCommentsResponse,
  GetListCommentsParams,
  GetListCommentsResponse,
  GetTaskCommentsParams,
  GetTaskCommentsResponse,
  GetThreadedCommentsResponse,
  UpdateCommentParams,
} from "./types";

export class Comments extends Base {
  /**
   * Get all comments for a task
   *
   * @description returns up to 25 comments maximum per request. Use `start` and `start_id` for paginated results
   * @param task_id as the id of the task to fetch comments for
   * @returns A list of 25 max comments on a task
   * @see https://developer.clickup.com/reference/gettaskcomments
   */
  public async getTaskComments(task_id: string, params: GetTaskCommentsParams) {
    return this.request<GetTaskCommentsResponse>(`/task/${task_id}/comment`, {
      method: "GET",
      query: {
        custom_task_ids: params.custom_task_ids,
        team_id: params.team_id,
        start: params.start,
        start_id: params.start_id,
      },
    });
  }

  /**
   * Create a comment on a task
   *
   * @param task_id as the id of the task to create a comment on
   * @see https://developer.clickup.com/reference/createtaskcomment
   */
  public async createTaskComment(
    task_id: string,
    params: CreateTaskCommentParams,
  ) {
    return this.request<CreateTaskCommentResponse>(`/task/${task_id}/comment`, {
      method: "POST",
      body: {
        comment_text: params.comment_text,
        assignee: params.assignee,
        group_assignee: params.group_assignee,
        notify_all: params.notify_all,
      } satisfies CreateTaskCommentBody,
      query: {
        custom_task_ids: params.custom_task_ids,
        team_id: params.team_id,
      },
    });
  }

  /**
   * Get chat view comments
   *
   * @param view_id as the id of the chat view to fetch comments for
   * @returns A list of comments for a chat view
   * @see https://developer.clickup.com/reference/getchatviewcomments
   */
  public async getChatViewComments(
    view_id: string,
    params: GetChatViewCommentsParams,
  ) {
    return this.request<GetChatViewCommentsResponse>(
      `/view/${view_id}/comment`,
      {
        method: "GET",
        query: {
          start: params.start,
          start_id: params.start_id,
        },
      },
    );
  }

  /**
   * Create a comment on a chat view
   *
   * @param view_id as the id of the chat view to create a comment on
   * @see https://developer.clickup.com/reference/createchatviewcomment
   */
  public async createChatViewComment(
    view_id: string,
    params: CreateChatViewCommentParams,
  ) {
    return this.request<CreateChatViewCommentResponse>(
      `/view/${view_id}/comment`,
      {
        method: "POST",
        body: {
          comment_text: params.comment_text,
          notify_all: params.notify_all,
        },
      },
    );
  }

  /**
   * Get list comments
   *
   * @param list_id as the id of the list to fetch comments for
   * @returns A list of comments for a list
   * @see https://developer.clickup.com/reference/getlistcomments
   */
  public async getListComments(list_id: string, params: GetListCommentsParams) {
    return this.request<GetListCommentsResponse>(`/list/${list_id}/comment`, {
      method: "GET",
      query: {
        start: params.start,
        start_id: params.start_id,
      },
    });
  }

  /**
   * Create a comment on a list
   *
   * @param list_id as the id of the list to create a comment on
   * @see https://developer.clickup.com/reference/createlistcomment
   */
  public async createListComment(
    list_id: string,
    params: CreateListCommentParams,
  ) {
    return this.request<CreateListCommentResponse>(`/list/${list_id}/comment`, {
      method: "POST",
      body: {
        ...params,
      },
    });
  }

  /**
   * Update a comment
   *
   * @param comment_id as the id of the comment to update
   * @see https://developer.clickup.com/reference/updatecomment
   */
  public async updateComment(
    comment_id: string,
    params: Partial<UpdateCommentParams>,
  ) {
    return this.request<void>(`/comment/${comment_id}`, {
      method: "PUT",
      body: {
        ...params,
      },
    });
  }

  /**
   * Delete a comment
   *
   * @param comment_id as the id of the comment to delete
   * @see https://developer.clickup.com/reference/deletecomment
   */
  public async deleteComment(comment_id: string) {
    return this.request<void>(`/comment/${comment_id}`, {
      method: "DELETE",
    });
  }

  /**
   * Get threaded comments for a comment
   *
   * @description if a comment has a reply count of more than 0, you can fetch the threaded comments
   * @param comment_id as the id of the comment to fetch threaded comments for
   * @returns a list of comments that are threaded off of a comment
   * @see https://developer.clickup.com/reference/getthreadedcomments
   */
  public async getThreadedComments(comment_id: string) {
    return this.request<GetThreadedCommentsResponse>(
      `/comment/${comment_id}/reply`,
      {
        method: "GET",
      },
    );
  }

  /**
   * Create a threaded comment
   *
   * @param comment_id as the id of the comment to create a threaded comment on
   * @param params as the body of the threaded comment to create
   * @see https://developer.clickup.com/reference/createthreadedcomment
   */
  public async createThreadedComment(
    comment_id: string,
    params: CreateTaskCommentBody,
  ) {
    return this.request<void>(`/comment/${comment_id}/reply`, {
      method: "POST",
      body: {
        ...params,
      },
    });
  }
}
