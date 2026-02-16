# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-16

### Added

- Initial release of @kendew-agency/clickup-sdk
- Authorization methods:
  - OAuth token exchange (`getAccessToken`)
  - Get authorized user information (`getAuthorizedUser`)
- Task operations:
  - Get tasks from a list with filtering and pagination
  - Get single task by ID
  - Create, update, and delete tasks
  - Add and delete task dependencies
  - Add and delete task links
- Comment operations:
  - Task comments (get, create, update, delete)
  - Chat view comments (get, create)
  - List comments (get, create)
  - Threaded comments (get, create)
  - Pagination support for all comment endpoints
- Attachment operations:
  - Upload task attachments with multipart/form-data
  - Support for custom task IDs
- Custom Task Types:
  - Get workspace custom task types
- Spaces operations:
  - Get spaces in a workspace
  - Get single space by ID
  - Create, update, and delete spaces
- Folders operations:
  - Get folders in a space
  - Get single folder by ID
  - Create, update, and delete folders
- Lists operations:
  - Get lists in a folder
  - Get folderless lists in a space
  - Get single list by ID
  - Create, update, and delete lists
- Goals operations:
  - Get goals in a workspace
  - Get single goal by ID
  - Create, update, and delete goals
- Tags operations:
  - Get tags in a space
  - Create, update, and delete tags
  - Add and remove tags from tasks
- Custom Fields operations:
  - Get accessible custom fields
  - Set and remove custom field values
- Full TypeScript support with comprehensive type definitions
- Error handling with structured `Response<T>` type
- Custom headers support for all requests
- Configuration override with `withConfig()` method
- Support for custom task IDs across all relevant endpoints
- Comprehensive test suite with 311+ tests

### Documentation

- Complete README with installation instructions
- API method examples for all endpoints
- Authentication guide (Personal API Token and OAuth)
- Configuration examples
- Error handling patterns
- TypeScript usage examples
- Development setup instructions

[0.1.0]: https://github.com/Kendew-Agency/clickup-sdk/releases/tag/v0.1.0
