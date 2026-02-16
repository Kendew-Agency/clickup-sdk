import { Base } from "../base";
import type {
  CreateSpaceParams,
  CreateSpaceResponse,
  GetSpaceResponse,
  GetSpacesParams,
  GetSpacesResponse,
  UpdateSpaceParams,
  UpdateSpaceResponse,
} from "./types";

export class Spaces extends Base {
  /**
   * Get all spaces in a workspace
   *
   * @description returns spaces in a specific workspace (team)
   * @param team_id as the id of the workspace to fetch spaces for
   * @param params optional parameters for filtering spaces
   * @returns A list of spaces in the workspace
   * @see https://developer.clickup.com/reference/getspaces
   */
  public async getSpaces(team_id: string, params?: GetSpacesParams) {
    return this.request<GetSpacesResponse>(`/team/${team_id}/space`, {
      method: "GET",
      query: {
        archived: params?.archived,
      },
    });
  }

  /**
   * Get a single space
   *
   * @description returns details of a specific space
   * @param space_id as the id of the space to fetch
   * @returns Space details
   * @see https://developer.clickup.com/reference/getspace
   */
  public async getSpace(space_id: string) {
    return this.request<GetSpaceResponse>(`/space/${space_id}`, {
      method: "GET",
    });
  }

  /**
   * Create a new space in a workspace
   *
   * @description creates a new space in the specified workspace
   * @param team_id as the id of the workspace to create the space in
   * @param params space creation parameters
   * @returns Created space details
   * @see https://developer.clickup.com/reference/createspace
   */
  public async createSpace(team_id: string, params: CreateSpaceParams) {
    return this.request<CreateSpaceResponse>(`/team/${team_id}/space`, {
      method: "POST",
      body: {
        name: params.name,
        multiple_assignees: params.multiple_assignees,
        features: params.features,
      },
    });
  }

  /**
   * Update a space
   *
   * @description updates properties of an existing space
   * @param space_id as the id of the space to update
   * @param params space update parameters
   * @returns Updated space details
   * @see https://developer.clickup.com/reference/updatespace
   */
  public async updateSpace(space_id: string, params: UpdateSpaceParams) {
    return this.request<UpdateSpaceResponse>(`/space/${space_id}`, {
      method: "PUT",
      body: {
        name: params.name,
        color: params.color,
        private: params.private,
        admin_can_manage: params.admin_can_manage,
        multiple_assignees: params.multiple_assignees,
        features: params.features,
      },
    });
  }

  /**
   * Delete a space
   *
   * @description deletes a space from the workspace
   * @param space_id as the id of the space to delete
   * @see https://developer.clickup.com/reference/deletespace
   */
  public async deleteSpace(space_id: string) {
    return this.request<void>(`/space/${space_id}`, {
      method: "DELETE",
    });
  }
}
