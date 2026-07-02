import type { CreateTaskAttachemntResponse } from "../methods/attachments/types";
import type { CommentAttachmentElement } from "../methods/comments/types";

export function buildAttachmentElement(
  response: CreateTaskAttachemntResponse,
): CommentAttachmentElement {
  const attachmentData = {
    id: response.id,
    name: response.title,
    title: response.title,
    extension: response.extension,
    thumbnail_small: response.thumbnail_small,
    thumbnail_medium: response.thumbnail_medium,
    thumbnail_large: response.thumbnail_large,
    url: response.url,
  };

  return {
    text: response.title,
    type: "attachment",
    attachment: attachmentData,
    attributes: {
      "data-id": response.id,
      "data-attachment": attachmentData,
    },
  };
}
