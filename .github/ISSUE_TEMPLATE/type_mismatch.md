---
name: Type Mismatch
about: Report incorrect TypeScript types or API response discrepancies
title: '[TYPES] '
labels: types, bug
assignees: ''
---

## Type Mismatch Description

A clear description of the type mismatch between the SDK types and actual ClickUp API response.

## Affected Method

Which SDK method is affected?

- Method: [e.g., `clickup.tasks.getTask()`]
- Endpoint: [e.g., `GET /api/v2/task/{task_id}`]

## Expected Type

What type does the SDK currently define?

```typescript
// Current SDK type definition
interface Task {
  id: string;
  name: string;
  // ...
}
```

## Actual API Response

What does the ClickUp API actually return?

```json
{
  "id": "task_123",
  "name": "My Task",
  "unexpected_field": "value that doesn't match types"
}
```

## TypeScript Error (if applicable)

```
Paste any TypeScript compilation errors here
```

## Environment

- SDK Version: [e.g., 0.1.0]
- TypeScript Version: [e.g., 5.3.3]

## Proposed Fix

If you have a suggestion for how to fix the types:

```typescript
// Proposed type definition
interface Task {
  id: string;
  name: string;
  unexpected_field?: string; // Add missing field
}
```

## Additional Context

- ClickUp API Documentation: [link if available]
- Is this field always present or conditional?
- Any other relevant information
