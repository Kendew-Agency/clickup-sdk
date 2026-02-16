import { Base } from "../base";
import type {
  CreateSpaceTagParams,
  CreateSpaceTagResponse,
  GetSpaceTagsResponse,
  UpdateSpaceTagParams,
  UpdateSpaceTagResponse,
} from "./types";

export class Tags extends Base {
  /**
   * Get all tags in a space
   *
   * @description returns all task tags in a specific space
   * @param space_id as the id of the space to fetch tags for
   * @returns A list of tags in the space
   * @see https://developer.clickup.com/reference/getspacetags
   */
  public async getSpaceTags(space_id: string) {
    return this.request<GetSpaceTagsResponse>(`/space/${space_id}/tag`, {
      method: "GET",
    });
  }

  /**
   * Create a new tag in a space
   *
   * @description creates a new task tag in the specified space
   * @param space_id as the id of the space to create the tag in
   * @param params tag creation parameters
   * @returns Created tag details
   * @see https://developer.clickup.com/reference/createspacetag
   */
  public async createSpaceTag(space_id: string, params: CreateSpaceTagParams) {
    return this.request<CreateSpaceTagResponse>(`/space/${space_id}/tag`, {
      method: "POST",
      body: {
        tag: params.tag,
      },
    });
  }

  /**
   * Update a tag in a space
   *
   * @description updates properties of an existing tag
   * @param space_id as the id of the space containing the tag
   * @param tag_name as the name of the tag to update
   * @param params tag update parameters
   * @returns Updated tag details
   * @see https://developer.clickup.com/reference/editspacetag
   */
  public async updateSpaceTag(
    space_id: string,
    tag_name: string,
    params: UpdateSpaceTagParams,
  ) {
    return this.request<UpdateSpaceTagResponse>(
      `/space/${space_id}/tag/${tag_name}`,
      {
        method: "PUT",
        body: {
          tag: params.tag,
        },
      },
    );
  }

  /**
   * Delete a tag from a space
   *
   * @description deletes a task tag from the space
   * @param space_id as the id of the space containing the tag
   * @param tag_name as the name of the tag to delete
   * @see https://developer.clickup.com/reference/deletespacetag
   */
  public async deleteSpaceTag(space_id: string, tag_name: string) {
    return this.request<void>(`/space/${space_id}/tag/${tag_name}`, {
      method: "DELETE",
    });
  }
}
