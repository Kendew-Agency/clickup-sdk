// biome-ignore lint/style/useNamingConvention: CONSTANT_CASE used for error code type (pre-existing)
export type CLICKUP_ERROR_CODE_KEY = "unauthorized" | "unknow_error";

export type Response<T> =
  | {
      data: T;
      error: null;
    }
  | { error: ErrorResponse; data: null };

export type ErrorResponse = {
  message: string;
  statusCode: number | null;
  name: CLICKUP_ERROR_CODE_KEY;
};
