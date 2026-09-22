import { Base } from "../base";
import type {
  GetFolderCustomFieldsResponse,
  GetListCustomFieldsResponse,
  GetSpaceCustomFieldsResponse,
  GetWorkspaceCustomFieldsResponse,
  RemoveCustomFieldValueParams,
  SetCustomFieldValueParams,
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
   * Get custom fields available in a folder
   *
   * @description returns custom fields accessible in a specific folder
   * @param folder_id as the id of the folder to fetch custom fields for
   * @returns A list of custom fields available in the folder
   * @see https://developer.clickup.com/reference/getfolderavailablefields
   */
  public async getFolderCustomFields(folder_id: string) {
    return this.request<GetFolderCustomFieldsResponse>(
      `/folder/${folder_id}/field`,
      {
        method: "GET",
      },
    );
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

  /**
   * Set Custom Field Value
   *
   * @description sets the value of a custom field on a task
   * @param task_id as the id of the task
   * @param field_id as the id of the custom field
   * @param params custom field value and optional custom task ID parameters
   * @see https://developer.clickup.com/reference/setcustomfieldvalue
   */
  public async setCustomFieldValue(
    task_id: string,
    field_id: string,
    params: SetCustomFieldValueParams,
  ) {
    return this.request<void>(`/task/${task_id}/field/${field_id}`, {
      method: "POST",
      query: {
        custom_task_ids: params.custom_task_ids,
        team_id: params.team_id,
      },
      body: {
        value: params.value,
        value_options: params.value_options,
      },
    });
  }

  /**
   * Remove Custom Field Value
   *
   * @description removes the value of a custom field from a task
   * @param task_id as the id of the task
   * @param field_id as the id of the custom field
   * @param params optional parameters for custom task IDs
   * @see https://developer.clickup.com/reference/removecustomfieldvalue
   */
  public async removeCustomFieldValue(
    task_id: string,
    field_id: string,
    params?: RemoveCustomFieldValueParams,
  ) {
    return this.request<void>(`/task/${task_id}/field/${field_id}`, {
      method: "DELETE",
      query: {
        custom_task_ids: params?.custom_task_ids,
        team_id: params?.team_id,
      },
    });
  }
}
