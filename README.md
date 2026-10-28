# SvelteKit service worker sourcemap reproduction

Reproduces missing user-source mappings in SvelteKit 3.1.0's service worker env transform.

## Reproduce

Use Node.js 24 and Bun 1.4.4:

```sh
bun install --frozen-lockfile
bun run build
bun run verify
```

The build succeeds but reports `SOURCEMAP_BROKEN` for `vite-plugin-sveltekit-service-worker-env`. The verification command exits with an assertion failure.

`src/service-worker.js` contains three lines. Its `console.log` on line 2 should map back to that file, line 2, column 3 (one-based). The emitted `.svelte-kit/output/client/service-worker.js.map` instead omits the user source; the mapping lookup falls back to SvelteKit's generated env module.

## Expected result

The user service worker is included in `sources`, and the marker maps to its original location. The verification command passes.

## Fix verification

Applying only the `env-vars.js` change from [sveltejs/kit#17566](https://github.com/sveltejs/kit/pull/17566) to the installed package removes the warning and makes the same verification pass:

```json
{
  "originalSource": "../../../src/service-worker.js",
  "originalLine": 1,
  "originalColumn": 2
}
```

These sourcemap coordinates are zero-based. This repository intentionally retains the unpatched dependency and failing reproduction.
