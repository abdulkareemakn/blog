import fs from 'node:fs';
import { defineEcConfig, ExpressiveCodeTheme } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

const lightRaw = fs.readFileSync(
  new URL('./src/styles/light.json', import.meta.url),
  'utf-8'
);
const darkRaw = fs.readFileSync(
  new URL('./src/styles/dark.json', import.meta.url),
  'utf-8'
);

const lightTheme = ExpressiveCodeTheme.fromJSONString(lightRaw);
const darkTheme = ExpressiveCodeTheme.fromJSONString(darkRaw);

export default defineEcConfig({
  themes: [lightTheme, darkTheme],
  removeUnusedThemes: true,
  themeCssSelector: (theme) =>
    `[data-theme='${theme.name.includes('Dark') ? 'dark' : 'light'}']`,
  useThemedScrollbars: false,
  plugins: [pluginLineNumbers()],
  defaultProps: {
    showLineNumbers: false,
  },
  styleOverrides: {
    codeBackground: 'var(--background)',
    frames: {
      frameBoxShadowCssValue: 'none',
      terminalBackground: 'var(--background)',
      terminalTitlebarBackground: 'var(--background)',
    },
  },
});
