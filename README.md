# dsh-kanso-theme

A [kanso.nvim](https://github.com/webhooked/kanso.nvim) colorscheme for the
DeepSeek Harness web UI.

Dark mode uses the kanso **mist** palette, light mode the **pearl** palette.
The colors apply automatically — the light/dark/system preference switches
between the two. Also includes:

- kanso syntax colors for code snippets (shiki `syn` palette)
- larger code snippet font (15px/25px)
- slightly larger chat message text

Colors are taken verbatim from `lua/kanso/colors.lua` in the upstream repo.

## Install

Requires a DSH installation with the `web` profile.

```sh
dsh plugin --profile web add dsh-kanso-theme
```

Add the plugin row to `~/.dsh/profiles/web/cordis.patch.yml`:

```yaml
- insert:
    - id: kanso-theme
      name: dsh-kanso-theme
```

Restart `dsh web`.

### From source (development)

```sh
git clone https://github.com/icewind/dsh-kanso-theme
dsh plugin --profile web add link:/path/to/dsh-kanso-theme
```

Then add the same patch row. With `link:`, edits to `client.js` take effect
on the next restart — no reinstall needed. To use a fixed copy instead,
install with `file:<path>`.

## Uninstall

Remove the patch row above, then:

```sh
dsh plugin --profile web remove dsh-kanso-theme
```

## Files

- `package.json` — package manifest with the `dsh.client` browser declaration
- `index.js` — host-side entry (empty apply; the browser plugin ships via `./client`)
- `client.js` — the browser-half Cordis plugin (all the theming logic)

## How it works

All themed tokens are stacked as a single
`theme.overrideTokens('dsh-kanso-theme', …)` layer carrying every token in
both light and dark modes. The layer composes over whichever built-in theme
the active preference resolves to, so the kanso palette applies without any
selection.

Syntax colors and font rules are applied by a plugin-owned stylesheet:

- the code font targets the shiki `<pre>` directly, because the code-block
  wrapper re-declares `--dsl-code-block-content-font` on itself;
- deliverable cards re-declare `--deliverable-fill` on their own root class,
  so that variable is re-declared on the element itself.

## Token mapping

### Core

| DSH token                          | mist (dark)         | pearl (light)      |
| ---------------------------------- | ------------------- | ------------------ |
| `--dsw-alias-bg-base`               | `#22262d` mistBg0   | `#f2f1ef` pearlWhite0 |
| `--dsw-alias-bg-layer-1`            | `#2a2c35` mistBg1   | `#e2e1df` pearlWhite1 |
| `--dsw-alias-bg-layer-2`            | `#393b44` mistBg2   | `#dddddb` pearlWhite2 |
| `--dsw-alias-bg-overlay`            | `#393b44` mistBg2   | `#cacac7` pearlWhite3 |
| `--dsw-alias-border-l1`             | `#4b4e57` inkBg4    | `#cacac7` pearlWhite3 |
| `--dsw-alias-border-l2`             | `#5c6066` mistBg3   | `#9f9f99` pearlGray4 |
| `--dsw-alias-brand-primary`         | `#7fb4ca` blue      | `#4d699b` pearlBlue4 |
| `--dsw-alias-label-primary`         | `#c5c9c7` fg        | `#22262d` pearlBlack0 |
| `--dsw-alias-label-secondary`       | `#909398` gray3     | `#6d6d69` pearlGray3 |
| `--dsw-alias-state-error-primary`   | `#e46876` red2      | `#c84053` pearlRed |
| `--dsw-alias-state-success-primary` | `#98bb6c` green     | `#6f894e` pearlGreen |
| `--dsw-alias-state-warn-primary`    | `#dca561` yellow    | `#e98a00` pearlOrange2 |
| `--dsw-specific-sidebar-fill`       | `#2a2c35` mistBg1   | `#e2e1df` pearlWhite1 |

### Surfaces

| Token                                   | mist (dark)             | pearl (light)      |
| --------------------------------------- | ----------------------- | ------------------ |
| `--dsw-specific-input-major`            | `#2a2c35` mistBg1       | `#e2e1df` pearlWhite1 |
| `--dsw-alias-markdown-inline-code`      | `#393b44` mistBg2       | `#dddddb` pearlWhite2 |
| `--dsw-alias-markdown-code-block`       | `#2a2c35` mistBg1       | `#e2e1df` pearlWhite1 |
| `--dsw-alias-markdown-code-block-banner`| `#393b44` mistBg2       | `#dddddb` pearlWhite2 |
| `--dsw-alias-border-l3` / `l4`          | `#5c6066` / `#75797f`   | `#9f9f99` / `#6d6d69` |
| `--dsw-specific-bubble`                 | `#2a2c35` mistBg1       | `#e2e1df` pearlWhite1 |
| `--dsw-specific-bubble-highlight`       | `#393b44` mistBg2       | `#dddddb` pearlWhite2 |
| `--dsw-alias-interactive-bg-hover`      | `rgba(57,59,68,.45)`    | `rgba(202,202,199,.5)` |
| `--dsw-alias-interactive-bg-hover-solid`| `#393b44` mistBg2       | `#cacac7` pearlWhite3 |

### Syntax colors

| Shiki token        | mist (dark)       | pearl (light)      |
| ------------------ | ----------------- | ------------------ |
| string             | `#8a9a7b` green3  | `#6f894e` pearlGreen |
| string-expression  | `#87a987` green2  | `#6e915f` pearlGreen2 |
| constant           | `#a292a3` pink    | `#b35b79` pearlPink |
| keyword            | `#8992a7` violet2 | `#624c83` pearlViolet4 |
| function           | `#8ba4b0` blue3   | `#4d699b` pearlBlue4 |
| parameter          | `#909398` gray3   | `#5d57a3` pearlBlue5 |
| comment            | `#75797f` gray4   | `#6d6d69` pearlGray3 |
| punctuation        | `#909398` gray3   | `#6d6d69` pearlGray3 |
| link               | `#7fb4ca` blue    | `#6693bf` pearlTeal2 |

## License

MIT
