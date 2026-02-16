import { Base } from "../base";
import type { GetCustomTaskTypesResponse } from "./types";

export class CustomTaskTypes extends Base {
  /**
   * Get all custom task types for your workspace
   *
   * @param team_id as your workspace id
   * @returns an array of custom task types
   */
  public async getCustomTaskTypes(team_id: number) {
    return this.request<GetCustomTaskTypesResponse>(
      `/team/${team_id}/custom_item`,
      {
        method: "GET",
      },
    );
  }
}
