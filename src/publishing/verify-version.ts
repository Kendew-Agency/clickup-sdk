/**
 * Result of verifying that a pushed git tag matches the package version.
 *
 * `pass` mirrors the bash predicate in `.github/workflows/publish.yml`: the
 * resolved tag version must equal the `package.json` version for publishing to
 * proceed.
 */
export type VerifyVersionResult =
  | { pass: true }
  | { pass: false; tagVersion: string; packageVersion: string };

/**
 * Removes `prefix` from the start of `value` when present.
 *
 * Equivalent to the shell parameter expansion `${value#prefix}` used in the
 * publish workflow.
 */
function stripPrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

/**
 * Verifies that a git tag ref resolves to the same version as `package.json`.
 *
 * Strips the `refs/tags/` prefix, then the leading `v`, and compares the
 * resulting version to `packageVersion`. Equal versions pass; any other case
 * fails. This mirrors the bash predicate in `.github/workflows/publish.yml`.
 *
 * @param gitRef - The git ref, e.g. `refs/tags/v1.2.3`.
 * @param packageVersion - The version from `package.json`, e.g. `1.2.3`.
 */
export function verifyVersion(
  gitRef: string,
  packageVersion: string,
): VerifyVersionResult {
  const tag = stripPrefix(gitRef, "refs/tags/");
  const tagVersion = stripPrefix(tag, "v");

  if (tagVersion === packageVersion) {
    return { pass: true };
  }

  return { pass: false, tagVersion, packageVersion };
}
