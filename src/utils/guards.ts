import type {
  CommentElement,
  CommentEmoticonElement,
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
