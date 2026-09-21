# Writing a Permanent DSH Plugin — Field Guide

Everything below was learned building `dsh-kanso-theme` (a browser-side UI
plugin) in a live session. It covers the full path from a dynamic Cordis
prototype to a permanent plugin that loads automatically in every session.

## The two plugin worlds

| | Dynamic Cordis plugin | Permanent (profile) plugin |
|---|---|---|
| Created via | `cordis_define` / `cordis_run` tools | A package installed into a profile + a composition row |
| Lifetime | Current process only; gone on restart | Every session, automatically, no approval |
| Code shape | Function body returning a plugin object; sandboxed (`styles.insert`, restricted `ctx`) | Real package: host ESM entry + prebuilt browser bundle |
| Best for | Prototyping, one-off session extensions | Anything you want to keep |

The productive workflow is: prototype as a dynamic plugin, then port the
working logic into a package. The theming *logic* ported almost verbatim;
only the packaging around it changed.

## Package layout

A permanent plugin is a small npm-style package with two halves:

```
my-plugin/
├── package.json   # manifest + dsh.client browser declaration
├── index.js       # host half (may be an empty stub)
└── client.js      # browser half — MUST be a __ModuleLoader__ bundle
```

### package.json

For a package you intend to publish, drop `private: true` and carry the
usual npm metadata plus a `files` allowlist:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "…",
  "keywords": ["dsh", "deepseek-harness", "…"],
  "license": "MIT",
  "author": "you",
  "repository": { "type": "git", "url": "git+https://github.com/you/my-plugin.git" },
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js"
  },
  "files": ["index.js", "client.js", "README.md", "LICENSE"],
  "dsh": {
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-ui-theme"]
    }
  }
}
```

- `exports["./client"]` is how the host finds the browser bundle.
- `dsh.client.platform: "web"` puts the package on the browser roster; a row
  whose package declares this gets its client half loaded into every page.
- `dsh.client.inject` lists packages whose browser modules must be
  registered before yours (module load order — e.g. the package that
  provides a service you consume).

### index.js (host half)

The host mounts the package main as a Cordis plugin. If all your logic is
browser-side, ship an empty stub — this is the shipped convention for pure
UI plugins:

```js
// Host plugin body — no host-side behavior for this surface plugin.
export function apply() {}
```

### client.js (browser half)

**The single most important finding:** the web client does *not* load
`client.js` as a normal ES module. It concatenates many plugins into one
bundle, so every entry must register itself through the module loader:

```js
window.__ModuleLoader__.load({
	id: "my-plugin",           // MUST match the package name exactly
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		// ... your logic (plain JS, no imports unless declared in
		// dsh.client.inject / external) ...

		exports.inject = ["theme"];   // Cordis hard-dependency service names
		exports.apply = apply;
		return module.exports;
	}
});
```

A raw `export function apply(...)` file is syntactically valid but poisons
the whole concatenated bundle — the harness breaks with errors like
`bundle … loaded without registering "<pkg>" via __ModuleLoader__.load`,
and even unrelated plugins (e.g. `dsh-client-hmr`) fail to load. Check with
`node --check client.js`, and test the factory in isolation with a stubbed
`window.__ModuleLoader__` before installing.

## Installing

Two steps, both outside the session workspace (expect sandbox approval):

```sh
# 1. Install the package into the profile (pnpm add under the hood).
#    From npm once published:
dsh plugin --profile web add my-plugin
#    Local development — link: symlinks, so later edits apply on restart;
#    file: installs a fixed copy instead:
dsh plugin --profile web add link:/absolute/path/to/my-plugin
```

```yaml
# 2. ~/.dsh/profiles/web/cordis.patch.yml — add the composition row:
- insert:
    - id: my-plugin        # your row id
      name: my-plugin      # the package name
```

Then restart `dsh web`. The row mounts the host half, the `dsh.client`
declaration puts the browser half on the roster, and the page loads it in
every session — no approval, no per-session setup.

To remove: delete the patch row and
`dsh plugin --profile web remove my-plugin`.

A warning during install — "declares no dsh.bundle — installed as a plain
dependency" — is harmless; the manual patch row is what mounts it.

## Publishing to npm and GitHub

Ship the repo with `LICENSE`, `.gitignore`, a user-facing `README.md`
(install/uninstall from npm first, from-source second), and a GitHub
Actions workflow that releases automatically.

**Pre-flight:** `npm pack --dry-run` must list exactly the intended files —
the `files` allowlist keeps internal notes and workflow files out of the
tarball.

**Release workflow** (`.github/workflows/release.yml`, triggered on push to
`main`):

1. `node --check` each shipped JS file — a broken bundle never ships.
2. Read the version from `package.json` and ask npm whether it already
   exists (`npm view <pkg>@<version> version`). Already published ⇒ the run
   succeeds without re-publishing, so doc-only pushes don't fail.
3. `npm publish --access public` with `NODE_AUTH_TOKEN: secrets.NPM_TOKEN`.
4. Create the `v<version>` tag and a GitHub release with generated notes
   (`softprops/action-gh-release@v2`, `GITHUB_TOKEN` needs no setup).

One-time setup: add an npm **Automation** access token as the `NPM_TOKEN`
secret in repo Settings → Secrets and variables → Actions.

**Release flow** once wired: bump `version` in `package.json`, commit to
`main`, push — the action does the rest. On consumer machines, install with
`dsh plugin --profile web add <pkg>` plus the same patch row.

## Client-plugin gotchas found the hard way

1. **Declare `inject` for services you need at boot.** On a cold boot your
   plugin may mount *before* the service provider (e.g. `theme`). With only
   `ctx.get('theme')` and no `inject: ['theme']`, you read `undefined` and
   silently skip — the plugin "works" after a reload but not after a
   restart. Declaring the injection parks the plugin until the service
   exists. Symptom to remember: *works after edit, default after restart*.

2. **`ctx.get(name)` + undefined check** for optional services; `inject` only
   for hard dependencies. Same rules as dynamic plugins.

3. **Own every side effect.** Stylesheets, DOM additions, service
   registrations — create them inside `apply` via `ctx.effect(() => { …
   return () => cleanup })` so unloading the plugin removes them. (In a
   dynamic plugin the same job is done by the `styles.insert` builtin,
   which does *not* exist in a real package — inject a `<style>` tag
   yourself.)

4. **Debug with console instrumentation, then remove it.** When a plugin
   loads but does nothing, sprinkle `console.log('[my-plugin] …')` at
   entry, around service reads, and in effects, restart, and read the
   browser console (F12). Remove the logging before publishing.

## Theming findings (if your plugin touches the UI)

- **`theme.overrideTokens(source, tokens)`** is the right primitive for
  applying a colorscheme automatically: one layer, every token keyed with
  both modes — `{ light: <value>, dark: <value> }` — composes over
  whichever built-in theme is active. Dark/light/system then flips between
  your two palettes with nothing to select.
- **`theme.register()` themes are not user-selectable**: the Appearance
  settings row only lists the built-in `light`/`dark`/`system` enum, so
  registered third-party theme ids never show up as options. Don't rely on
  registration for delivery.
- **CSS custom-property shadowing**: components may re-declare a variable on
  their own class (`--deliverable-fill` on card roots,
  `--dsl-code-block-content-font` on the code-block wrapper), which shadows
  any `:root` override. Re-declare the variable on the element itself with
  an equal-or-higher specificity selector (a later stylesheet wins ties).
- **Static grays exist outside the token system** (`--dsw-static-*`,
  hard-coded component variables). Grep the shipped CSS
  (`node_modules/@deepseek-ai/dsh-web-frontend/dist/assets/*.css` and the
  `dsh-client-ui-*` packages) for the exact variable a surface consumes
  before assuming a token override will reach it.
- **Discover tokens empirically**: `grep -ohE '\-\-dsw-alias-[a-z0-9-]+' … |
  sort -u` lists every alias token the UI actually consumes.

## Testing checklist before publishing

1. `node --check client.js` — plain-script syntax (no ESM syntax inside the
   factory wrapper's file body beyond the wrapper itself).
2. Run the factory with a stubbed `window.__ModuleLoader__` and stub
   services; assert `exports.inject` / `exports.apply` and that `apply`
   does what you expect.
3. Install, add the patch row, **restart `dsh web`** — verify on a cold
   boot, not just after an edit (see gotcha 1).
4. Check the browser console for your plugin's registration and for errors.
5. Toggle light/dark/system if you ship both palettes.
6. Remove the patch row and uninstall — confirm the UI returns to stock.
