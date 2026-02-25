# @kendew-agency/clickup-sdk

A type-safe Node.js SDK for the ClickUp API, built with TypeScript.

> **⚠️ Work in Progress**: This SDK is under active development. Not all ClickUp API methods are implemented yet. Check the [API Methods](#api-methods) section below for currently available endpoints. Some endpoints may also miss some functions.

> **📝 Note on ClickUp API**: The actual data returned by ClickUp's API may sometimes differ from their official documentation. We strive to keep our types accurate based on real-world API responses, but discrepancies may occur. Please report any type mismatches you encounter.

## Installation

```bash
npm install @kendew-agency/clickup-sdk
```

```bash
pnpm add @kendew-agency/clickup-sdk
```

```bash
yarn add @kendew-agency/clickup-sdk
```

## Quick Start

```typescript
import { ClickUp } from "@kendew-agency/clickup-sdk";

const clickup = new ClickUp({
  apiToken: "your_api_token_here",
});

// Get authorized user
const user = await clickup.authorization.getAuthorizedUser();

// Get tasks from a list
const tasks = await clickup.tasks.getTasks("list_id");

// Create a task
const newTask = await clickup.tasks.createTask("list_id", {
  name: "My new task",
  description: "Task description",
});
```

## Authentication

The SDK supports two authentication methods:

### Personal API Token

Generate a personal API token from your ClickUp settings:

```typescript
const clickup = new ClickUp({
  apiToken: "pk_your_personal_token",
});
```

### OAuth Token

Use OAuth for user-specific access:

```typescript
// Exchange authorization code for access token
const tokenResponse = await clickup.authorization.getAccessToken({
  client_id: "your_client_id",
  client_secret: "your_client_secret",
  code: "authorization_code",
});

// Create SDK instance with OAuth token
const clickup = new ClickUp({
  apiToken: tokenResponse.access_token,
});
```

## Configuration

### Basic Configuration

```typescript
const clickup = new ClickUp({
  apiToken: "your_token",
});
```

### Custom Headers

Add custom headers to all requests (useful for Next.js tags, etc.):

```typescript
const clickup = new ClickUp({
  apiToken: "your_token",
  headers: {
    "X-Custom-Header": "value",
  },
});
```

### Configuration Override

Create a new instance with modified configuration:

```typescript
const clickupWithCustomHeaders = clickup.withConfig({
  headers: {
    "X-Request-ID": "unique-id",
  },
});
```

## API Methods

### Currently Implemented

The following API endpoints are currently implemented in this SDK:

- **Authorization**: OAuth token exchange, get authorized user
- **Tasks**: Get, create, update, delete tasks, manage dependencies and links
- **Comments**: Task, list, and chat view comments with threading support
- **Attachments**: Upload task attachments
- **Custom Task Types**: Get workspace custom task types
- **Spaces**: Get, create, update, delete spaces
- **Folders**: Get, create, update, delete folders
- **Lists**: Get, create, update, delete lists
- **Goals**: Get, create, update, delete goals
- **Tags**: Get, create, update, delete tags, manage task tags
- **Custom Fields**: Get accessible fields, set and remove values

Additional ClickUp API endpoints will be added in future releases. Contributions are welcome!

### Authorization

```typescript
// Get access token via OAuth
const token = await clickup.authorization.getAccessToken({
  client_id: "your_client_id",
  client_secret: "your_client_secret",
  code: "authorization_code",
});

// Get authorized user information
const user = await clickup.authorization.getAuthorizedUser();
```

### Tasks

```typescript
// Get tasks from a list
const tasks = await clickup.tasks.getTasks("list_id", {
  page: 0,
  order_by: "created",
  reverse: true,
  subtasks: true,
  include_closed: false,
});

// Get a single task
const task = await clickup.tasks.getTask("task_id");

// Create a task
const newTask = await clickup.tasks.createTask("list_id", {
  name: "Task name",
  description: "Task description",
  assignees: [123],
  tags: ["tag1"],
  status: "Open",
  priority: 3,
  due_date: 1508369194377,
  notify_all: true,
});

// Update a task
const updated = await clickup.tasks.updateTask("task_id", {
  name: "Updated name",
  status: "In Progress",
  priority: 2,
});

// Delete a task
await clickup.tasks.deleteTask("task_id");

// Add task dependency
await clickup.tasks.addDependency("task_id", {
  depends_on: "other_task_id",
});

// Delete task dependency
await clickup.tasks.deleteDependency("task_id", {
  depends_on: "other_task_id",
});

// Add task link
await clickup.tasks.addTaskLink("task_id", {
  links_to: "other_task_id",
});

// Delete task link
await clickup.tasks.deleteTaskLink("task_id", {
  links_to: "other_task_id",
});
```

### Comments

```typescript
// Get task comments (paginated, max 25 per request)
const comments = await clickup.comments.getTaskComments("task_id", {
  start: 0,
});

// Create task comment
const comment = await clickup.comments.createTaskComment("task_id", {
  comment_text: "This is a comment",
  notify_all: true,
});

// Update comment
await clickup.comments.updateComment("comment_id", {
  comment_text: "Updated comment",
});

// Delete comment
await clickup.comments.deleteComment("comment_id");

// Get threaded comments
const replies = await clickup.comments.getThreadedComments("comment_id");

// Create threaded comment
await clickup.comments.createThreadedComment("comment_id", {
  comment_text: "Reply to comment",
});

// Get chat view comments
const chatComments = await clickup.comments.getChatViewComments("view_id", {
  start: 0,
});

// Create chat view comment
await clickup.comments.createChatViewComment("view_id", {
  comment_text: "Chat message",
});

// Get list comments
const listComments = await clickup.comments.getListComments("list_id", {
  start: 0,
});

// Create list comment
await clickup.comments.createListComment("list_id", {
  comment_text: "List comment",
});
```

### Attachments

```typescript
// Upload task attachment
const attachment = await clickup.attachments.createTaskAttachment(
  "task_id",
  {
    attachment: newFile, // File object
  },
);
```

### Custom Task Types

```typescript
// Get workspace custom task types
const taskTypes = await clickup.customTaskTypes.getCustomTaskTypes(
  "workspace_id",
);
```

### Spaces

```typescript
// Get spaces in a workspace
const spaces = await clickup.spaces.getSpaces("workspace_id", {
  archived: false,
});

// Get a single space
const space = await clickup.spaces.getSpace("space_id");

// Create a space
const newSpace = await clickup.spaces.createSpace("workspace_id", {
  name: "New Space",
  multiple_assignees: true,
  features: {
    due_dates: { enabled: true },
    time_tracking: { enabled: true },
  },
});

// Update a space
await clickup.spaces.updateSpace("space_id", {
  name: "Updated Space",
});

// Delete a space
await clickup.spaces.deleteSpace("space_id");
```

### Folders

```typescript
// Get folders in a space
const folders = await clickup.folders.getFolders("space_id", {
  archived: false,
});

// Get a single folder
const folder = await clickup.folders.getFolder("folder_id");

// Create a folder
const newFolder = await clickup.folders.createFolder("space_id", {
  name: "New Folder",
});

// Update a folder
await clickup.folders.updateFolder("folder_id", {
  name: "Updated Folder",
});

// Delete a folder
await clickup.folders.deleteFolder("folder_id");
```

### Lists

```typescript
// Get lists in a folder
const lists = await clickup.lists.getLists("folder_id", {
  archived: false,
});

// Get folderless lists in a space
const folderlessLists = await clickup.lists.getFolderlessLists("space_id", {
  archived: false,
});

// Get a single list
const list = await clickup.lists.getList("list_id");

// Create a list
const newList = await clickup.lists.createList("folder_id", {
  name: "New List",
  content: "List description",
  priority: 1,
  status: "active",
});

// Update a list
await clickup.lists.updateList("list_id", {
  name: "Updated List",
});

// Delete a list
await clickup.lists.deleteList("list_id");
```

### Goals

```typescript
// Get goals in a workspace
const goals = await clickup.goals.getGoals(123456);

// Get a single goal
const goal = await clickup.goals.getGoal("goal_id");

// Create a goal
const newGoal = await clickup.goals.createGoal(123456, {
  name: "Q1 Goals",
  due_date: 1609459200000,
  description: "First quarter objectives",
  multiple_owners: true,
  owners: [123],
  color: "#32a852",
});

// Update a goal
await clickup.goals.updateGoal("goal_id", {
  name: "Updated Goal",
});

// Delete a goal
await clickup.goals.deleteGoal("goal_id");
```

### Tags

```typescript
// Get tags in a space
const tags = await clickup.tags.getTags("space_id");

// Create a tag
const newTag = await clickup.tags.createTag("space_id", {
  name: "urgent",
});

// Update a tag
await clickup.tags.updateTag("space_id", "tag_name", {
  name: "high-priority",
});

// Delete a tag
await clickup.tags.deleteTag("space_id", "tag_name");

// Add tag to task
await clickup.tags.addTagToTask("task_id", {
  tag_name: "urgent",
});

// Remove tag from task
await clickup.tags.removeTagFromTask("task_id", "tag_name");
```

### Custom Fields

```typescript
// Get accessible custom fields
const customFields = await clickup.customFields.getAccessibleCustomFields(
  "list_id",
);

// Set custom field value
await clickup.customFields.setCustomFieldValue("task_id", "field_id", {
  value: "custom value",
});

// Remove custom field value
await clickup.customFields.removeCustomFieldValue("task_id", "field_id");
```

## Pagination

Many endpoints support pagination using `start` and `start_id` parameters:

```typescript
// First page
const firstPage = await clickup.comments.getTaskComments("task_id", {
  start: 0,
});

// Next page
const nextPage = await clickup.comments.getTaskComments("task_id", {
  start: 25,
  start_id: firstPage.comments[24].id,
});
```

## Custom Task IDs

ClickUp supports custom task IDs. Enable them in your requests:

```typescript
const task = await clickup.tasks.getTask("CUSTOM-123", {
  custom_task_ids: true,
  team_id: "your_team_id",
});
```

## Error Handling

The SDK uses a `Response<T>` type that includes error information:

```typescript
const result = await clickup.tasks.getTask("task_id");

if ("err" in result) {
  console.error("Error:", result.err);
  console.error("Error code:", result.ECODE);
} else {
  console.log("Task:", result);
}
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type {
  CreateTaskParams,
  GetTaskResponse,
  ClickUpConfig,
} from "@kendew-agency/clickup-sdk";
```

Import types from the `/types` export:

```typescript
import type { User, Pagination } from "@kendew-agency/clickup-sdk/types";
```

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Lint and format
pnpm biome check

# Auto-fix linting and formatting issues
pnpm biome check --write
```

## License

MIT

## Links

- [ClickUp API Documentation](https://developer.clickup.com/docs/)
- [GitHub Repository](https://github.com/Kendew-Agency/clickup-sdk)
- [Issue Tracker](https://github.com/Kendew-Agency/clickup-sdk/issues)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Known Issues

- Not all ClickUp API endpoints are implemented yet
- Some response types may not perfectly match ClickUp's documentation due to discrepancies between documented and actual API responses
- If you encounter type mismatches or missing methods, please open an issue with details about the endpoint and expected vs actual behavior
