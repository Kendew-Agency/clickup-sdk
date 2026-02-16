# Technology Stack

## Language & Runtime
- TypeScript (no explicit version, uses latest)
- Node.js

## Build & Development Tools
- **Biome** (v2.3.14): Used for linting and formatting
- **pnpm**: Package manager (evidenced by pnpm-lock.yaml)

## Code Quality
- Biome handles both linting and formatting
- No separate test framework configured yet

## Common Commands

### Linting & Formatting
```bash
# Run Biome linter
pnpm biome lint

# Run Biome formatter
pnpm biome format

# Check both linting and formatting
pnpm biome check

# Apply fixes automatically
pnpm biome check --write
```

### Testing
```bash
# Tests not yet configured
pnpm test
```

## Dependencies
- No runtime dependencies (pure TypeScript SDK)
- Single dev dependency: @biomejs/biome

## Code Style Enforcement
All code style is enforced through Biome configuration (biome.json):
- 2-space indentation
- 80 character line width
- Double quotes for strings
- Semicolons required
- Trailing commas enforced
- LF line endings
