import { Base } from "../base";
import type {
  CreateTaskAttachemntParams,
  CreateTaskAttachemntResponse,
} from "./types";

export class Attachments extends Base {
  /**
   * Create a new task attachment
   *
   * @param params paramaters for creating a task attachment
   * @returns the file stored in ClickUp or an error
   * @see https://developer.clickup.com/reference/createtaskattachment
   */
  public async createTaskAttachement(params: CreateTaskAttachemntParams) {
    // Clicup expects a multipart/form-data request

    // Create new formdata
    const formData = new FormData();
    // Sanitize file name by replacing spaces with dashes
    const sanitizedFileName = params.attachment.name.replace(/\s+/g, "-");
    // Append the attachment to the form data
    formData.append(`attachment`, params.attachment, sanitizedFileName);

    return this.request<CreateTaskAttachemntResponse>(
      `/task/${params.task_id}/attachment`,
      {
        method: "POST",
        query: {
          custom_task_ids: params.custom_task_ids,
          team_id: params.team_id,
        },
      },
    );
  }
}
