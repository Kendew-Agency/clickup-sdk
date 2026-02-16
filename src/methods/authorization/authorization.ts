import { Base } from "../base";
import type {
  AccessTokenResponse,
  GetAccessTokenParams,
  GetAuthorizedUserResponse,
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
        params,
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
}
