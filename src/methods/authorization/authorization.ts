import { Base } from "../base";
import type {
  AccessTokenResponse,
  GetAccessTokenParams,
  GetAuthorizedUserResponse,
  GetAuthorizedWorkspacesResponse,
} from "./types";

export class Authorization extends Base {
  /**
   *
   * @param params the parameters to get an access token
   * @returns data or an error
   * @see https://developer.clickup.com/reference/getaccesstoken
   */
  public async getAccessToken(params: GetAccessTokenParams) {
    return this.request<AccessTokenResponse>("/oauth/token", {
      method: "POST",
      body: {
        client_id: params.client_id,
        client_secret: params.client_secret,
        code: params.code,
      },
    });
  }

  /**
   * Get the authorized user connected to the current token
   * @returns data or an error
   * @see https://developer.clickup.com/reference/getauthorizeduser
   */
  public async getAuthorizedUser() {
    return this.request<GetAuthorizedUserResponse>("/user", {
      method: "GET",
    });
  }

  /**
   * Get Authorized Workspaces
   *
   * @description returns the workspaces available to the authenticated user
   * @returns A list of authorized workspaces
   * @see https://developer.clickup.com/reference/getauthorizedteams
   */
  public async getAuthorizedWorkspaces() {
    return this.request<GetAuthorizedWorkspacesResponse>("/team", {
      method: "GET",
    });
  }
}
