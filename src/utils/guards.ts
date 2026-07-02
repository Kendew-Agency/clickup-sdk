import type {
  CommentAttachmentElement,
  CommentElement,
  CommentEmoticonElement,
  CommentImageElement,
  CommentTagElement,
  CommentTextElement,
} from "../methods/comments/types";

/**
 * Type guard to check if a CommentElement is an emoticon element.
 */
export function isEmoticonElement(
  el: CommentElement,
): el is CommentEmoticonElement {
  return "type" in el && el.type === "emoticon";
}

/**
 * Type guard to check if a CommentElement is a tag (user mention) element.
 */
export function isTagElement(el: CommentElement): el is CommentTagElement {
  return "type" in el && el.type === "tag";
}

/**
 * Type guard to check if a CommentElement is a text element.
 */
export function isTextElement(el: CommentElement): el is CommentTextElement {
  return "text" in el && !isEmoticonElement(el);
}

/**
 * Type guard to check if a CommentElement is an attachment element.
 */
export function isAttachmentElement(
  el: CommentElement,
): el is CommentAttachmentElement {
  return "type" in el && el.type === "attachment";
}

/**
 * Type guard to check if a CommentElement is an image element.
 */
export function isImageElement(el: CommentElement): el is CommentImageElement {
  return "type" in el && el.type === "image";
}
