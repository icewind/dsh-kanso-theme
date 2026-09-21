window.__ModuleLoader__.load({
	id: "dsh-kanso-theme",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		// Kanso theme, browser half.
		// Palette source: https://github.com/webhooked/kanso.nvim (lua/kanso/colors.lua)
		//
		// Applies the kanso colorscheme automatically in both schemes by
		// stacking a full token override layer over the active theme:
		//   dark mode  -> kanso 'mist' palette
		//   light mode -> kanso 'pearl' palette
		// No theme selection needed; the light/dark/system preference
		// switches between the two kanso palettes.

		// Every themed dsw token, dark (mist) values. kanso palette names in
		// comments follow lua/kanso/colors.lua.
		const MIST = {
			// base surfaces
			'--dsw-alias-bg-base': '#22262d', // mistBg0
			'--dsw-alias-bg-layer-1': '#2a2c35', // mistBg1
			'--dsw-alias-bg-layer-2': '#393b44', // mistBg2
			'--dsw-alias-bg-layer-3': '#4b4e57', // inkBg4
			'--dsw-alias-bg-overlay': '#393b44', // mistBg2
			'--dsw-alias-bg-mask-1': 'rgba(20,23,29,0.6)', // inkBg0
			'--dsw-alias-bg-module-platform': '#1f1f26', // inkBg1
			'--dsw-alias-tooltip-bg': '#14171d', // inkBg0
			'--dsw-alias-border-l1': '#4b4e57', // inkBg4
			'--dsw-alias-border-l2': '#5c6066', // mistBg3
			'--dsw-alias-border-l2-darkmode-thin': '#5c6066', // mistBg3
			'--dsw-alias-border-l3': '#5c6066', // mistBg3
			'--dsw-alias-border-l4': '#75797f', // gray4
			// identity
			'--dsw-alias-brand-primary': '#7fb4ca', // blue
			'--dsw-alias-link': '#7fb4ca', // blue
			'--dsw-alias-label-primary': '#c5c9c7', // fg
			'--dsw-alias-label-secondary': '#909398', // gray3
			'--dsw-alias-label-tertiary': '#75797f', // gray4
			'--dsw-alias-label-caption': '#717c7c', // gray
			'--dsw-alias-label-dimmed': '#5c6066', // gray5
			'--dsw-alias-label-primary-inverted': '#14171d', // inkBg0
			'--dsw-alias-label-primary-foreground': '#14171d', // inkBg0
			// states
			'--dsw-alias-state-error-primary': '#e46876', // red2
			'--dsw-alias-state-success-primary': '#98bb6c', // green
			'--dsw-alias-state-warn-primary': '#dca561', // yellow
			'--dsw-alias-state-warn-label': '#dca561', // yellow
			'--dsw-alias-state-success-tertiary': '#2b3328', // diffGreen
			'--dsw-alias-state-warn-tertiary': '#49443c', // diffYellow
			'--dsw-alias-state-business-primary': '#7fb4ca', // blue
			// interactive + buttons
			'--dsw-alias-interactive-bg-hover': 'rgba(57,59,68,0.45)', // mistBg2
			'--dsw-alias-interactive-bg-hover-solid': '#393b44', // mistBg2
			'--dsw-alias-interactive-bg-hover-danger': 'rgba(196,64,67,0.25)', // red
			'--dsw-alias-button-tool-bar-fill': '#2a2c35', // mistBg1
			'--dsw-alias-button-tool-bar-hover': '#393b44', // mistBg2
			'--dsw-alias-button-floating-fill': '#393b44', // mistBg2
			'--dsw-alias-button-ghost-active-fill': '#393b44', // mistBg2
			'--dsw-alias-button-ghost-active-border': '#5c6066', // mistBg3
			'--dsw-alias-button-primary-fill': '#7fb4ca', // blue
			'--dsw-alias-button-primary-hover': '#6ebbd4', // blueSaturated
			'--dsw-alias-button-contrast-fill': '#c5c9c7', // fg
			// code + content surfaces
			'--dsw-alias-markdown-inline-code': '#393b44', // mistBg2
			'--dsw-alias-markdown-code-block': '#2a2c35', // mistBg1
			'--dsw-alias-markdown-code-block-banner': '#393b44', // mistBg2
			'--dsw-alias-markdown-tag': '#393b44', // mistBg2
			'--dsw-alias-scrollbar-bg-l2': 'rgba(92,96,102,0.4)', // mistBg3
			'--dsw-alias-scrollbar-hover-l2': '#5c6066', // mistBg3
			// specific surfaces
			'--dsw-specific-sidebar-fill': '#2a2c35', // mistBg1
			'--dsw-specific-sidebar-nav-item-hover': 'rgba(57,59,68,0.45)', // mistBg2
			'--dsw-specific-sidebar-nav-item-active': '#393b44', // mistBg2
			'--dsw-specific-sidebar-nav-item-active-accent': '#7fb4ca', // blue
			'--dsw-specific-input-major': '#2a2c35', // mistBg1
			'--dsw-specific-login-input': '#2a2c35', // mistBg1
			'--dsw-specific-bubble': '#2a2c35', // mistBg1
			'--dsw-specific-bubble-highlight': '#393b44', // mistBg2
			'--dsw-specific-menu': '#2a2c35', // mistBg1
			'--dsw-specific-tip': '#2a2c35', // mistBg1 — raised inline panel (e.g. TODO card)
			'--dsw-specific-selector': '#393b44', // mistBg2
		};

		// Same token set, light (pearl) values.
		const PEARL = {
			'--dsw-alias-bg-base': '#f2f1ef', // pearlWhite0
			'--dsw-alias-bg-layer-1': '#e2e1df', // pearlWhite1
			'--dsw-alias-bg-layer-2': '#dddddb', // pearlWhite2
			'--dsw-alias-bg-layer-3': '#cacac7', // pearlWhite3
			'--dsw-alias-bg-overlay': '#cacac7', // pearlWhite3
			'--dsw-alias-bg-mask-1': 'rgba(242,241,239,0.7)', // pearlWhite0
			'--dsw-alias-bg-module-platform': '#e2e1df', // pearlWhite1
			'--dsw-alias-tooltip-bg': '#22262d', // inkBg2
			'--dsw-alias-border-l1': '#cacac7', // pearlWhite3
			'--dsw-alias-border-l2': '#9f9f99', // pearlGray4
			'--dsw-alias-border-l2-darkmode-thin': '#9f9f99', // pearlGray4
			'--dsw-alias-border-l3': '#9f9f99', // pearlGray4
			'--dsw-alias-border-l4': '#6d6d69', // pearlGray3
			'--dsw-alias-brand-primary': '#4d699b', // pearlBlue4
			'--dsw-alias-link': '#4d699b', // pearlBlue4
			'--dsw-alias-label-primary': '#22262d', // pearlBlack0
			'--dsw-alias-label-secondary': '#6d6d69', // pearlGray3
			'--dsw-alias-label-tertiary': '#9f9f99', // pearlGray4
			'--dsw-alias-label-caption': '#6d6d69', // pearlGray3
			'--dsw-alias-label-dimmed': '#9f9f99', // pearlGray4
			'--dsw-alias-label-primary-inverted': '#f2f1ef', // pearlWhite0
			'--dsw-alias-label-primary-foreground': '#f2f1ef', // pearlWhite0
			'--dsw-alias-state-error-primary': '#c84053', // pearlRed
			'--dsw-alias-state-success-primary': '#6f894e', // pearlGreen
			'--dsw-alias-state-warn-primary': '#e98a00', // pearlOrange2
			'--dsw-alias-state-warn-label': '#cc6d00', // pearlOrange
			'--dsw-alias-state-success-tertiary': '#b7d0ae', // pearlGreen3
			'--dsw-alias-state-warn-tertiary': '#f9d791', // pearlYellow4
			'--dsw-alias-state-business-primary': '#4d699b', // pearlBlue4
			'--dsw-alias-interactive-bg-hover': 'rgba(202,202,199,0.5)', // pearlWhite3
			'--dsw-alias-interactive-bg-hover-solid': '#cacac7', // pearlWhite3
			'--dsw-alias-interactive-bg-hover-danger': 'rgba(200,64,83,0.15)', // pearlRed
			'--dsw-alias-button-tool-bar-fill': '#e2e1df', // pearlWhite1
			'--dsw-alias-button-tool-bar-hover': '#cacac7', // pearlWhite3
			'--dsw-alias-button-floating-fill': '#cacac7', // pearlWhite3
			'--dsw-alias-button-ghost-active-fill': '#cacac7', // pearlWhite3
			'--dsw-alias-button-ghost-active-border': '#9f9f99', // pearlGray4
			'--dsw-alias-button-primary-fill': '#4d699b', // pearlBlue4
			'--dsw-alias-button-primary-hover': '#2a73b1', // pearlBlue4Saturated
			'--dsw-alias-button-contrast-fill': '#22262d', // pearlBlack0
			'--dsw-alias-markdown-inline-code': '#dddddb', // pearlWhite2
			'--dsw-alias-markdown-code-block': '#e2e1df', // pearlWhite1
			'--dsw-alias-markdown-code-block-banner': '#dddddb', // pearlWhite2
			'--dsw-alias-markdown-tag': '#dddddb', // pearlWhite2
			'--dsw-alias-scrollbar-bg-l2': 'rgba(159,159,153,0.4)', // pearlGray4
			'--dsw-alias-scrollbar-hover-l2': '#9f9f99', // pearlGray4
			'--dsw-specific-sidebar-fill': '#e2e1df', // pearlWhite1
			'--dsw-specific-sidebar-nav-item-hover': 'rgba(202,202,199,0.5)', // pearlWhite3
			'--dsw-specific-sidebar-nav-item-active': '#cacac7', // pearlWhite3
			'--dsw-specific-sidebar-nav-item-active-accent': '#4d699b', // pearlBlue4
			'--dsw-specific-input-major': '#e2e1df', // pearlWhite1
			'--dsw-specific-login-input': '#e2e1df', // pearlWhite1
			'--dsw-specific-bubble': '#e2e1df', // pearlWhite1
			'--dsw-specific-bubble-highlight': '#dddddb', // pearlWhite2
			'--dsw-specific-menu': '#e2e1df', // pearlWhite1
			'--dsw-specific-tip': '#e2e1df', // pearlWhite1 — raised inline panel
			'--dsw-specific-selector': '#cacac7', // pearlWhite3
		};

		// Syntax colors for shiki code snippets, kanso 'syn' palette:
		// :root = pearl, body[data-ds-dark-theme] = mist.
		// Also fixes surfaces plain token overrides cannot reach:
		// - text selection uses kanso's bg_visual (no ::selection rule
		//   ships with the UI, so the browser default applies otherwise);
		// - deliverable cards declare --deliverable-fill on their own root
		//   class (a static gray), shadowing any :root value and tying our
		//   selector on specificity — the doubled attribute selector
		//   outspecifies it in both schemes regardless of stylesheet order;
		// - the code-block wrapper re-declares --dsl-code-block-content-font
		//   on itself, so the code font targets the shiki <pre> directly;
		// - chat message body text is bumped one step via the markdown base
		//   font token, leaving headings/code/tool calls untouched.
		const CSS = `
:root{
  --shiki-token-string:#6f894e;
  --shiki-token-string-expression:#6e915f;
  --shiki-token-constant:#b35b79;
  --shiki-token-keyword:#624c83;
  --shiki-token-function:#4d699b;
  --shiki-token-parameter:#5d57a3;
  --shiki-token-comment:#6d6d69;
  --shiki-token-punctuation:#6d6d69;
  --shiki-token-link:#6693bf;
}
body[data-ds-dark-theme]{
  --shiki-token-string:#8a9a7b;
  --shiki-token-string-expression:#87a987;
  --shiki-token-constant:#a292a3;
  --shiki-token-keyword:#8992a7;
  --shiki-token-function:#8ba4b0;
  --shiki-token-parameter:#909398;
  --shiki-token-comment:#75797f;
  --shiki-token-punctuation:#909398;
  --shiki-token-link:#7fb4ca;
}
[class*="_root"][class*="_root"]{--deliverable-fill:#e2e1df;--deliverable-hover:#cacac7;}
body[data-ds-dark-theme] [class*="_root"][class*="_root"]{--deliverable-fill:#2a2c35;--deliverable-hover:#393b44;}
::selection{background:#dddddb;color:#22262d;}               /* pearlWhite2 / pearlBlack0 */
body[data-ds-dark-theme] ::selection{background:#393b44;color:#c5c9c7;} /* mistBg2 / fg */
pre[class*="shiki"]{font:400 15px/25px var(--ds-font-family-code);}
[class*="_bubble"]{font-size:calc(var(--dsh-content-font-size,14px) + 1px);line-height:calc(24px + var(--dsh-content-font-delta,0px) + 2px);}
[class*="_markdown_"]{--dsw-font-markdown-base:400 calc(var(--dsh-content-font-size,14px) + 1px)/calc(24px + var(--dsh-content-font-delta,0px) + 2px) var(--dsw-font-family);}
`;

		// Hard dependency: parks this plugin until the theme service exists,
		// so the override layer is always applied on a cold boot.
		const inject = ["theme"];

		function apply(ctx) {
			const theme = ctx.get("theme");
			if (theme !== undefined) {
				// One override layer carrying every themed token in both
				// modes; it composes over whichever built-in theme the
				// active preference resolves to.
				const modes = {};
				for (const key in MIST) modes[key] = { light: PEARL[key], dark: MIST[key] };
				theme.overrideTokens("dsh-kanso-theme", modes);
			}

			// Plugin-owned stylesheet, removed on unload.
			ctx.effect(() => {
				const tag = document.createElement("style");
				tag.setAttribute("data-plugin-css", "dsh-kanso-theme");
				tag.textContent = CSS;
				document.head.appendChild(tag);
				return () => tag.remove();
			});
		}

		exports.inject = inject;
		exports.apply = apply;
		return module.exports;
	}
});
