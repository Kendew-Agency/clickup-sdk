import { Base } from "../base";
import type {
  GetListCustomFieldsResponse,
  GetSpaceCustomFieldsResponse,
  GetWorkspaceCustomFieldsResponse,
} from "./types";

export class CustomFields extends Base {
  /**
   * Get custom fields available in a list
   *
   * @description returns custom fields accessible in a specific list
   * @param list_id as the id of the list to fetch custom fields for
   * @returns A list of custom fields available in the list
   * @see https://developer.clickup.com/reference/getaccessiblecustomfields
   */
  public async getListCustomFields(list_id: string) {
    return this.request<GetListCustomFieldsResponse>(`/list/${list_id}/field`, {
      method: "GET",
    });
  }

  /**
   * Get custom fields available in a space
   *
   * @description returns custom fields created at the space level only
   * @param space_id as the id of the space to fetch custom fields for
   * @returns A list of custom fields available in the space
   * @see https://developer.clickup.com/reference/getspaceavailablefields
   */
  public async getSpaceCustomFields(space_id: string) {
    return this.request<GetSpaceCustomFieldsResponse>(
      `/space/${space_id}/field`,
      {
        method: "GET",
      },
    );
  }

  /**
   * Get custom fields available in a workspace
   *
   * @description returns custom fields created at the workspace level only
   * @param team_id as the id of the workspace (team) to fetch custom fields for
   * @returns A list of custom fields available in the workspace
   * @see https://developer.clickup.com/reference/getteamavailablefields
   */
  public async getWorkspaceCustomFields(team_id: string) {
    return this.request<GetWorkspaceCustomFieldsResponse>(
      `/team/${team_id}/field`,
      {
        method: "GET",
      },
    );
  }
}
