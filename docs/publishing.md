# Publishing

This package is published to npm using **trusted publishing** (OIDC). GitHub
Actions exchanges a short-lived, workflow-scoped OIDC token with the npm
registry at publish time, so no long-lived `NODE_AUTH_TOKEN` is stored in the
repository. Because the package is published from a public repository via OIDC,
provenance attestation is generated automatically.

Publishing runs from [`.github/workflows/publish.yml`](../.github/workflows/publish.yml)
and triggers on pushes of tags matching `v*` and on manual `workflow_dispatch`.

## OIDC release-gate flow

Every release runs an ordered quality gate before the publish step. If any gate
step fails, the job stops and nothing is published:

1. **Typecheck** — `pnpm run typecheck`
2. **Test** — `pnpm test`
3. **Build** — `pnpm run build`
4. **Verify version** — the `package.json` version must match the pushed tag
   (`refs/tags/v<X>`). A mismatch stops the job before publish.
5. **Publish with provenance** — `npm publish --provenance --access public`

Notes:

- Publishing uses the **`npm` CLI** (not pnpm), because OIDC token exchange and
  provenance are implemented by npm. The Node runtime is Node.js 24, which
  bundles npm 11.5.1+ (required for OIDC trusted publishing).
- Under OIDC there is no persistent authentication, so `npm whoami` reports
  "not authenticated" even when a publish will succeed. This is expected and not
  an error.
- `--access public` is required for the scoped `@kendew-agency/*` package.

## Manual setup — npmjs.com trusted publisher

> **⚠️ MANUAL, NON-AUTOMATABLE STEP.** The trusted-publisher registration is a
> one-time human action performed in the npmjs.com web UI. It cannot be done by
> a workflow or a coding agent. OIDC publishing will fail with an authentication
> error until this is configured.

In the **npmjs.com package settings** for the package, add a **GitHub Actions**
trusted publisher with the following values:

| Field                  | Value           |
| ---------------------- | --------------- |
| Organization or user   | `Kendew-Agency` |
| Repository             | `clickup-sdk`   |
| Workflow filename      | `publish.yml`   |
| Environment            | _(leave empty — no environment)_ |

The environment field must be left blank; the publish workflow does not use a
GitHub Environment, so the trusted-publisher config must not require one either.

## Follow-up — restrict long-lived npm tokens

Once OIDC trusted publishing is verified working (a new version is live on npm
with a provenance attestation), restrict or remove any remaining long-lived npm
automation tokens for this package. With trusted publishing in place, those
tokens are no longer needed for releases, and removing them reduces the risk of
credential exposure.
