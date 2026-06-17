# Project guide

Personal CMS: a yarn-workspaces monorepo (`packages/common`, `packages/client`, `packages/server`).
Express + MongoDB backend, React SPA frontend, bundled with esbuild, deployed to GCP Cloud Run.

- Package manager: **yarn classic 1.22.22**, pinned via `packageManager` (run through `corepack`).
- Node: **22.x**.
- Build: `yarn build` runs `scripts/build.ts` (esbuild). The server bundle externalizes only `express`.
- The deploy path (`Dockerfile` → Cloud Run) builds with esbuild and **does not run `tsc`**; `tsc --noEmit`
  (via `yarn server lint`) currently reports pre-existing type errors that do not block the build.

## Dependency security policy

This project guards against npm supply-chain attacks (e.g. Shai-Hulud, the Sept-2025 chalk/debug
"qix" compromise), whose payloads run through package **install lifecycle scripts**.

**Install scripts are disabled on the trusted/automated paths.** esbuild ships its binary via an
optional platform package, so the bundle builds fine with `--ignore-scripts`:
- The production `Dockerfile` installs with `yarn install --frozen-lockfile --ignore-scripts`.
- CI (`.github/workflows/audit.yml`) installs the same way and then runs `yarn build` to prove it.

**Refreshing or adding dependencies — do it in two steps so nothing untrusted runs before it is scanned:**

1. Resolve/refresh the lockfile **without executing scripts**:
   - In-range refresh: `yarn upgrade --ignore-scripts`
   - Add a package: `yarn add <pkg> --ignore-scripts`
   - Bump an exact pin: edit the version in the relevant `package.json`, then `yarn install --ignore-scripts`
2. **Scan the new `yarn.lock` before a scripted install.** All deps must resolve from the official
   registry (`registry.npmjs.org` / `registry.yarnpkg.com`); none of the chalk/debug "qix" compromised
   versions may appear (e.g. `debug@4.4.2`, `ansi-styles@6.2.2`, `chalk@5.6.1`). Offline check:
   ```
   osv-scanner --lockfile=yarn.lock
   ```
3. Only then run a normal `yarn install` (scripts enabled) and verify with `yarn build`.

**Lockfile integrity:** always install with `--frozen-lockfile` in CI/prod so the lockfile cannot
silently drift to a re-resolved (possibly compromised) version. Keep `packageManager` pinned (it carries
an integrity hash that corepack verifies).

**Major-version upgrades** (e.g. `mongodb` 6→7, `mongoose` 8→9, `@mui/*` 7→9, `typescript` 5→6,
`react-scripts`) are intentionally deferred — bump them deliberately, one at a time, with testing.
