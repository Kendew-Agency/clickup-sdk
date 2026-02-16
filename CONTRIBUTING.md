# Contributing to @kendew-agency/clickup-sdk

Thank you for your interest in contributing to the ClickUp SDK! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/clickup-sdk.git
   cd clickup-sdk
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Linting and Formatting

We use Biome for linting and formatting:

```bash
# Check for linting and formatting issues
pnpm biome check

# Auto-fix issues
pnpm biome check --write
```

### Building

```bash
# Build the project
pnpm build

# Clean build artifacts
pnpm clean
```

## Code Style

- We use Biome for consistent code style
- 2-space indentation
- Double quotes for strings
- Semicolons required
- Trailing commas enforced
- All code must pass `pnpm biome check` before submission

## Project Structure

```
src/
├── clickup.ts          # Main SDK class
├── index.ts            # Public exports
├── interfaces.ts       # Shared interfaces
├── methods/            # API method implementations
│   ├── base.ts         # Abstract base class
│   └── [resource]/     # Resource-specific implementations
│       ├── [resource].ts
│       ├── [resource].test.ts
│       └── types.ts
└── types/              # Shared type definitions
```

## Adding New API Methods

When adding support for a new ClickUp API endpoint:

1. Create a new directory under `src/methods/` (e.g., `src/methods/webhooks/`)
2. Create the following files:
   - `[resource].ts` - Implementation extending `Base` class
   - `[resource].test.ts` - Comprehensive test suite
   - `types.ts` - TypeScript type definitions
3. Add the new method to the main `ClickUp` class in `src/clickup.ts`
4. Export types from `src/types/index.ts` if needed
5. Update the README with usage examples
6. Add tests covering:
   - Successful responses
   - Error handling
   - Query parameter handling
   - Request body validation

### Example Structure

```typescript
// src/methods/webhooks/webhooks.ts
import { Base } from "../base";
import type { GetWebhooksResponse, CreateWebhookBody } from "./types";

export class Webhooks extends Base {
  async getWebhooks(teamId: string): Promise<GetWebhooksResponse> {
    return this.request(`/team/${teamId}/webhook`);
  }
}
```

## Testing Guidelines

- Write tests for all new functionality
- Aim for high test coverage
- Use descriptive test names
- Test both success and error cases
- Mock external API calls
- Follow existing test patterns in the codebase

## Commit Messages

We follow conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test additions or changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

Example:
```
feat: add webhook support
fix: handle null values in task responses
docs: update README with webhook examples
```

## Pull Request Process

1. Create a new branch for your feature:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes and commit them
3. Ensure all tests pass: `pnpm test`
4. Ensure code style is correct: `pnpm biome check`
5. Push to your fork and create a pull request
6. Provide a clear description of your changes
7. Link any related issues

### Pull Request Checklist

- [ ] Tests added/updated and passing
- [ ] Code passes linting (`pnpm biome check`)
- [ ] Documentation updated (README, JSDoc comments)
- [ ] Types are properly defined
- [ ] CHANGELOG.md updated (for significant changes)
- [ ] Commit messages follow conventional format

## Reporting Issues

When reporting issues, please include:

- SDK version
- Node.js version
- Clear description of the problem
- Minimal reproduction example
- Expected vs actual behavior
- Any error messages or stack traces

## Questions?

Feel free to open an issue for questions or discussions about:

- API design decisions
- Implementation approaches
- Feature requests
- Bug reports

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
