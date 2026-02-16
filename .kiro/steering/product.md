# Product Overview

This is a Node.js SDK for the ClickUp API. It provides a type-safe TypeScript interface for interacting with ClickUp's project management platform.

The SDK is designed to be:
- Type-safe with full TypeScript support
- Modular with method-based organization
- Configurable with flexible authentication options
- Error-handled with structured response types

The library follows ClickUp's official API documentation and provides a clean, developer-friendly interface for Node.js applications.

## Implemented Features

### Authorization
- OAuth token exchange (getAccessToken)
- Get authorized user information (getAuthorizedUser)

### Comments
- Task comments: get, create, update, delete
- Chat view comments: get, create
- List comments: get, create
- Threaded comments: get, create
- Pagination support for comment retrieval

### Attachments
- Upload task attachments with multipart/form-data
- Automatic filename sanitization (spaces to dashes)
- Support for custom task IDs

### Custom Task Types
- Retrieve workspace custom task types
- Access custom item configurations
