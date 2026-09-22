import { Base } from "../base";
import type {
  CreateFolderFromTemplateParams,
  CreateFolderFromTemplateResponse,
  CreateFolderParams,
  CreateFolderResponse,
  GetFolderResponse,
  GetFoldersParams,
  GetFoldersResponse,
  MoveFolderParams,
  UpdateFolderParams,
  UpdateFolderResponse,
} from "./types";

export class Folders extends Base {
  /**
   * Get all folders in a space
   *
   * @description returns folders in a specific space
   * @param space_id as the id of the space to fetch folders for
   * @param params optional parameters for filtering folders
   * @returns A list of folders in the space
   * @see https://developer.clickup.com/reference/getfolders
   */
  public async getFolders(space_id: string, params?: GetFoldersParams) {
    return this.request<GetFoldersResponse>(`/space/${space_id}/folder`, {
      method: "GET",
      query: {
        archived: params?.archived,
      },
    });
  }

  /**
   * Get a single folder
   *
   * @description returns details of a specific folder
   * @param folder_id as the id of the folder to fetch
   * @returns Folder details
   * @see https://developer.clickup.com/reference/getfolder
   */
  public async getFolder(folder_id: string) {
    return this.request<GetFolderResponse>(`/folder/${folder_id}`, {
      method: "GET",
    });
  }

  /**
   * Create a new folder in a space
   *
   * @description creates a new folder in the specified space
   * @param space_id as the id of the space to create the folder in
   * @param params folder creation parameters
   * @returns Created folder details
   * @see https://developer.clickup.com/reference/createfolder
   */
  public async createFolder(space_id: string, params: CreateFolderParams) {
    return this.request<CreateFolderResponse>(`/space/${space_id}/folder`, {
      method: "POST",
      body: {
        name: params.name,
      },
    });
  }

  /**
   * Update a folder
   *
   * @description updates properties of an existing folder
   * @param folder_id as the id of the folder to update
   * @param params folder update parameters
   * @returns Updated folder details
   * @see https://developer.clickup.com/reference/updatefolder
   */
  public async updateFolder(folder_id: string, params: UpdateFolderParams) {
    return this.request<UpdateFolderResponse>(`/folder/${folder_id}`, {
      method: "PUT",
      body: {
        name: params.name,
      },
    });
  }

  /**
   * Delete a folder
   *
   * @description deletes a folder from the workspace
   * @param folder_id as the id of the folder to delete
   * @see https://developer.clickup.com/reference/deletefolder
   */
  public async deleteFolder(folder_id: string) {
    return this.request<void>(`/folder/${folder_id}`, {
      method: "DELETE",
    });
  }

  /**
   * Create Folder from template
   *
   * @description creates a new folder from a template within a space
   * @param space_id as the id of the space to create the folder in
   * @param template_id as the id of the folder template
   * @param params folder creation parameters
   * @returns Created folder details
   * @see https://developer.clickup.com/reference/createfolderfromtemplate
   */
  public async createFolderFromTemplate(
    space_id: string,
    template_id: string,
    params: CreateFolderFromTemplateParams,
  ) {
    return this.request<CreateFolderFromTemplateResponse>(
      `/space/${space_id}/folder_template/${template_id}`,
      {
        method: "POST",
        body: {
          name: params.name,
          parent_folder_id: params.parent_folder_id,
          options: params.options,
        },
      },
    );
  }

  /**
   * Move Folder
   *
   * @description moves a folder to another folder or space
   * @param folder_id as the id of the folder to move
   * @param params destination and position parameters
   * @see https://developer.clickup.com/reference/movefolder
   */
  public async moveFolder(folder_id: string, params: MoveFolderParams) {
    return this.request<void>(`/folder/${folder_id}/position`, {
      method: "PUT",
      body: {
        parent_folder_id: params.parent_folder_id,
        space_id: params.space_id,
        position: params.position,
        custom_type_map: params.custom_type_map,
      },
    });
  }
}
