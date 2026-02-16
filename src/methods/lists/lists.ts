import { Base } from "../base";
import type {
  CreateFolderlessListParams,
  CreateFolderlessListResponse,
  CreateListParams,
  CreateListResponse,
  GetFolderlessListsParams,
  GetFolderlessListsResponse,
  GetListResponse,
  GetListsParams,
  GetListsResponse,
  UpdateListParams,
  UpdateListResponse,
} from "./types";

export class Lists extends Base {
  /**
   * Get all lists in a folder
   *
   * @description returns lists within a specific folder
   * @param folder_id as the id of the folder to fetch lists for
   * @param params optional parameters for filtering lists
   * @returns A list of lists in the folder
   * @see https://developer.clickup.com/reference/getlists
   */
  public async getLists(folder_id: string, params?: GetListsParams) {
    return this.request<GetListsResponse>(`/folder/${folder_id}/list`, {
      method: "GET",
      query: {
        archived: params?.archived,
      },
    });
  }

  /**
   * Get folderless lists in a space
   *
   * @description returns lists in a space that aren't in a folder
   * @param space_id as the id of the space to fetch folderless lists for
   * @param params optional parameters for filtering lists
   * @returns A list of folderless lists in the space
   * @see https://developer.clickup.com/reference/getfolderlesslists
   */
  public async getFolderlessLists(
    space_id: string,
    params?: GetFolderlessListsParams,
  ) {
    return this.request<GetFolderlessListsResponse>(`/space/${space_id}/list`, {
      method: "GET",
      query: {
        archived: params?.archived,
      },
    });
  }

  /**
   * Get a single list
   *
   * @description returns details of a specific list
   * @param list_id as the id of the list to fetch
   * @returns List details
   * @see https://developer.clickup.com/reference/getlist
   */
  public async getList(list_id: string) {
    return this.request<GetListResponse>(`/list/${list_id}`, {
      method: "GET",
    });
  }

  /**
   * Create a new list in a folder
   *
   * @description creates a new list in the specified folder
   * @param folder_id as the id of the folder to create the list in
   * @param params list creation parameters
   * @returns Created list details
   * @see https://developer.clickup.com/reference/createlist
   */
  public async createList(folder_id: string, params: CreateListParams) {
    return this.request<CreateListResponse>(`/folder/${folder_id}/list`, {
      method: "POST",
      body: {
        name: params.name,
        content: params.content,
        due_date: params.due_date,
        due_date_time: params.due_date_time,
        priority: params.priority,
        assignee: params.assignee,
        status: params.status,
      },
    });
  }

  /**
   * Create a folderless list in a space
   *
   * @description creates a new list directly in a space without a folder
   * @param space_id as the id of the space to create the list in
   * @param params list creation parameters
   * @returns Created list details
   * @see https://developer.clickup.com/reference/createfolderlesslist
   */
  public async createFolderlessList(
    space_id: string,
    params: CreateFolderlessListParams,
  ) {
    return this.request<CreateFolderlessListResponse>(
      `/space/${space_id}/list`,
      {
        method: "POST",
        body: {
          name: params.name,
          content: params.content,
          due_date: params.due_date,
          due_date_time: params.due_date_time,
          priority: params.priority,
          assignee: params.assignee,
          status: params.status,
        },
      },
    );
  }

  /**
   * Update a list
   *
   * @description updates properties of an existing list
   * @param list_id as the id of the list to update
   * @param params list update parameters
   * @returns Updated list details
   * @see https://developer.clickup.com/reference/updatelist
   */
  public async updateList(list_id: string, params: UpdateListParams) {
    return this.request<UpdateListResponse>(`/list/${list_id}`, {
      method: "PUT",
      body: {
        name: params.name,
        content: params.content,
        due_date: params.due_date,
        due_date_time: params.due_date_time,
        priority: params.priority,
        assignee: params.assignee,
        unset_status: params.unset_status,
      },
    });
  }

  /**
   * Delete a list
   *
   * @description deletes a list from the workspace
   * @param list_id as the id of the list to delete
   * @see https://developer.clickup.com/reference/deletelist
   */
  public async deleteList(list_id: string) {
    return this.request<void>(`/list/${list_id}`, {
      method: "DELETE",
    });
  }
}
