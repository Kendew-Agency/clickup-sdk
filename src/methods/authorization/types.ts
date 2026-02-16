import type { User } from "../../types/clickup.types";

export type GetAccessTokenParams = {
  client_id: string;
  client_secret: string;
  code: string;
};

export type AccessTokenResponse = {
  access_token: string;
};

export type GetAuthorizedUserResponse = {
  user: User;
};
