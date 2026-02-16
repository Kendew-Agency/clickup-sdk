import { Attachments } from "./methods/attachments/attachments";
import { Authorization } from "./methods/authorization/authorization";
import { Comments } from "./methods/comments/comments";
import { CustomFields } from "./methods/custom-fields/custom-fields";
import { CustomTaskTypes } from "./methods/custom-task-types/custom-task-types";
import { Folders } from "./methods/folders/folders";
import { Goals } from "./methods/goals/goals";
import { Lists } from "./methods/lists/lists";
import { Spaces } from "./methods/spaces/spaces";
import { Tags } from "./methods/tags/tags";
import { Tasks } from "./methods/tasks/tasks";
import type { ClickUpConfig } from "./types/config.types";

/**
 * ClickUp SDK
 * @see https://developer.clickup.com/docs/
 */
export class ClickUp {
  private config: ClickUpConfig;
  // methods
  public attachments: Attachments;
  public authorization: Authorization;
  public comments: Comments;
  public customFields: CustomFields;
  public customTaskTypes: CustomTaskTypes;
  public folders: Folders;
  public goals: Goals;
  public lists: Lists;
  public spaces: Spaces;
  public tags: Tags;
  public tasks: Tasks;

  constructor(config: ClickUpConfig) {
    if (!config.apiToken) throw new Error("API token is required");
    this.config = config;

    this.attachments = new Attachments(this.config);
    this.authorization = new Authorization(this.config);
    this.comments = new Comments(this.config);
    this.customFields = new CustomFields(this.config);
    this.customTaskTypes = new CustomTaskTypes(this.config);
    this.folders = new Folders(this.config);
    this.goals = new Goals(this.config);
    this.lists = new Lists(this.config);
    this.spaces = new Spaces(this.config);
    this.tags = new Tags(this.config);
    this.tasks = new Tasks(this.config);
  }

  /**
   * Modify the ClickUp SDK instance
   * @description This shallow merges the current config with the new config and returns a new instance
   */
  public withConfig(overrides: Partial<ClickUpConfig>): ClickUp {
    return new ClickUp({
      ...this.config,
      ...overrides,
    });
  }
}
