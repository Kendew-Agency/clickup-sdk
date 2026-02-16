# Project Structure

## Directory Organization

```
src/
├── clickup.ts          # Main SDK class
├── index.ts            # Public exports
├── interfaces.ts       # Shared interfaces (Response, ErrorResponse)
├── methods/            # API method implementations
│   ├── base.ts         # Abstract base class for methods
│   ├── attachments/    # Task attachment operations
│   │   ├── attachments.ts
│   │   └── types.ts
│   ├── authorization/  # OAuth and user authentication
│   │   ├── authorization.ts
│   │   └── types.ts
│   ├── comments/       # Comment operations (tasks, lists, views)
│   │   ├── comments.ts
│   │   └── types.ts
│   └── custom-task-types/  # Custom task type retrieval
│       ├── custom-task-types.ts
│       └── types.ts
└── types/              # Type definitions
    ├── clickup.types.ts    # Shared ClickUp types (User, Pagination, etc.)
    ├── config.types.ts     # Configuration types
    └── index.ts            # Type exports
```

## Architecture Patterns

### Main SDK Class
- `ClickUp` class in `src/clickup.ts` is the primary entry point
- Constructor requires `ClickUpConfig` with API token
- Provides `withConfig()` method for creating modified instances

### Method Organization
- API methods extend the `Base` abstract class from `src/methods/base.ts`
- Base class provides protected access to config and request method
- Methods are organized by resource type in subdirectories:
  - `attachments/`: File upload operations
  - `authorization/`: OAuth and user authentication
  - `comments/`: Comment CRUD across tasks, lists, and views
  - `custom-task-types/`: Custom task type retrieval
- Each method directory contains:
  - Implementation file (e.g., `comments.ts`)
  - Type definitions file (`types.ts`)

### Type System
- Configuration types in `src/types/config.types.ts`
- Shared ClickUp types in `src/types/clickup.types.ts` (User, Pagination, etc.)
- Shared interfaces in `src/interfaces.ts`
- Generic `Response<T>` type for consistent error handling
- Method-specific types colocated in `methods/*/types.ts`
- All types exported through `src/types/index.ts`

### API Patterns
- Pagination: Uses `start` and `start_id` parameters for paginated results
- Custom Task IDs: Optional `custom_task_ids` and `team_id` query parameters
- Request bodies: Typed with dedicated `*Body` and `*Params` types
- Multipart uploads: FormData handling for file attachments

### Error Handling
- Structured error responses with `ErrorResponse` type
- Union type `Response<T>` for success/error states
- Error codes defined as `CLICKUP_ERROR_CODE_KEY`

## Naming Conventions

### Files
- kebab-case, camelCase, or PascalCase allowed
- Types files use `.types.ts` suffix
- Must be ASCII characters only

### Code
- Functions: PascalCase or camelCase
- Variables: camelCase, PascalCase, or CONSTANT_CASE
- Types/Interfaces: PascalCase
- No parameter reassignment allowed

## Export Strategy
- Main exports through `src/index.ts`
- Named exports only (no default exports preferred by style guide)
- Re-export all types for consumer convenience
