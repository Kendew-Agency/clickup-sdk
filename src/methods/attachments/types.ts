export type CreateTaskAttachemntParams = CreateTaskAttachemntParamsBase &
  CreateTaskAttachemntParamsConditional;

type CreateTaskAttachemntParamsBase = {
  /**
   * The attachment to upload.
   * @description this differs from the documentation. Yet attachment `array` is not the correct type.
   */
  attachment: File;
};

type CreateTaskAttachemntParamsConditional =
  | {
      custom_task_ids: true;
      team_id: number;
    }
  | {
      custom_task_ids?: false;
      team_id?: number;
    };

export type CreateTaskAttachemntResponse = {
  id: string;
  version: string;
  date: number;
  title: string;
  extension: string;
  thumbnail_small: string;
  thumbnail_large: string;
  url: string;
};
