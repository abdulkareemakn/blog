import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { defineEcConfig } from "astro-expressive-code";

export default defineEcConfig({
  themes: ["github-light", "github-dark"],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) => `[data-theme="${theme.type}"]`,
  useThemedScrollbars: false,
  frames: {
    extractFileNameFromCode: false,
    removeCommentsWhenCopyingTerminalFrames: false,
    showCopyToClipboardButton: true,
  },
  plugins: [pluginLineNumbers()],
  defaultProps: {
    frame: "code",
    showLineNumbers: false,
  },
  styleOverrides: {
    borderColor: "var(--border)",
    borderRadius: "var(--radius-md)",
    borderWidth: "1px",
    codeBackground: "var(--muted)",
    codeFontFamily: "var(--font-mono)",
    codeFontSize: "0.85rem",
    codeLineHeight: "1.7",
    codePaddingBlock: "1rem",
    codePaddingInline: "1.15rem",
    frames: {
      editorActiveTabBackground: "var(--muted)",
      editorActiveTabBorderColor: "transparent",
      editorActiveTabIndicatorBottomColor: "transparent",
      editorActiveTabIndicatorTopColor: "transparent",
      editorTabBarBackground: "var(--muted)",
      editorTabBarBorderColor: "var(--border)",
      editorTabBarBorderBottomColor: "var(--border)",
      frameBoxShadowCssValue: "none",
      inlineButtonForeground: "var(--muted-foreground)",
    },
    uiFontFamily: "var(--font-mono)",
  },
});
