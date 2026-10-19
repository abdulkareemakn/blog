/*
 * Syntax themes for Expressive Code, built from the Monokai Pro Light
 * (Filter Sun) and Monokai Pro (Filter Spectrum) palettes so code blocks match
 * the site's UI tokens.
 *
 * These are deliberately hand-authored Shiki theme objects rather than copies
 * of the VS Code theme files: Monokai Pro is not redistributable, and only the
 * colour values and a subset of standard TextMate scopes are needed here.
 */

const sun = {
  name: "monokai-pro-light-sun",
  type: "light",
  colors: {
    "editor.background": "#fdf7f3",
    "editor.foreground": "#2c232e",
    "editor.lineHighlightBackground": "#2c232e0c",
    "editor.selectionBackground": "#72696d26",
    "editorCursor.foreground": "#2c232e",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#8a8185", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "keyword.operator",
        "keyword.control",
        "storage.modifier",
        "keyword.declaration",
      ],
      settings: { foreground: "#ce4770" },
    },
    {
      scope: [
        "storage.type",
        "entity.name.type",
        "entity.name.class",
        "support.type",
        "support.class",
        "entity.name.namespace",
        "entity.name.type.class",
      ],
      settings: { foreground: "#2473b6", fontStyle: "italic" },
    },
    {
      scope: ["string", "string.unquoted.label", "string.other.link.title"],
      settings: { foreground: "#b16803" },
    },
    {
      scope: [
        "constant",
        "constant.numeric",
        "constant.language",
        "constant.character.escape",
        "constant.other",
        "support.constant",
        "variable.other.constant",
        "variable.other.enummember",
      ],
      settings: { foreground: "#6851a2" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "variable.function",
        "meta.function-call",
        "support.macro",
      ],
      settings: { foreground: "#218871" },
    },
    {
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: { foreground: "#ce4770" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#2473b6", fontStyle: "italic" },
    },
    {
      scope: [
        "variable",
        "variable.other",
        "variable.other.property",
        "variable.other.member",
        "meta.object.member",
        "support.type.property-name",
        "text",
      ],
      settings: { foreground: "#2c232e" },
    },
    {
      scope: [
        "variable.parameter",
        "meta.interpolation",
        "constant.other.placeholder",
        "markup.raw",
      ],
      settings: { foreground: "#d4572b", fontStyle: "italic" },
    },
    {
      scope: ["punctuation", "meta.brace", "meta.delimiter"],
      settings: { foreground: "#92898a" },
    },
    {
      scope: ["markup.heading", "entity.name.section"],
      settings: { foreground: "#b16803" },
    },
    {
      scope: ["markup.underline.link", "markup.inserted"],
      settings: { foreground: "#218871" },
    },
    {
      scope: ["markup.deleted"],
      settings: { foreground: "#ce4770" },
    },
    {
      scope: ["markup.changed"],
      settings: { foreground: "#b16803" },
    },
    {
      scope: ["invalid"],
      settings: { foreground: "#ce4770", fontStyle: "italic underline" },
    },
  ],
};

const spectrum = {
  name: "monokai-pro-spectrum",
  type: "dark",
  colors: {
    "editor.background": "#2a2a2a",
    "editor.foreground": "#f7f1ff",
    "editor.lineHighlightBackground": "#f7f1ff0c",
    "editor.selectionBackground": "#bab6c026",
    "editorCursor.foreground": "#f7f1ff",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#8b888f", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "keyword.operator",
        "keyword.control",
        "storage.modifier",
        "keyword.declaration",
      ],
      settings: { foreground: "#fc618d" },
    },
    {
      scope: [
        "storage.type",
        "entity.name.type",
        "entity.name.class",
        "support.type",
        "support.class",
        "entity.name.namespace",
        "entity.name.type.class",
      ],
      settings: { foreground: "#5ad4e6", fontStyle: "italic" },
    },
    {
      scope: ["string", "string.unquoted.label", "string.other.link.title"],
      settings: { foreground: "#fce566" },
    },
    {
      scope: [
        "constant",
        "constant.numeric",
        "constant.language",
        "constant.character.escape",
        "constant.other",
        "support.constant",
        "variable.other.constant",
        "variable.other.enummember",
      ],
      settings: { foreground: "#948ae3" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "variable.function",
        "meta.function-call",
        "support.macro",
      ],
      settings: { foreground: "#7bd88f" },
    },
    {
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: { foreground: "#fc618d" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#5ad4e6", fontStyle: "italic" },
    },
    {
      scope: [
        "variable",
        "variable.other",
        "variable.other.property",
        "variable.other.member",
        "meta.object.member",
        "support.type.property-name",
        "text",
      ],
      settings: { foreground: "#f7f1ff" },
    },
    {
      scope: [
        "variable.parameter",
        "meta.interpolation",
        "constant.other.placeholder",
        "markup.raw",
      ],
      settings: { foreground: "#fd9353", fontStyle: "italic" },
    },
    {
      scope: ["punctuation", "meta.brace", "meta.delimiter"],
      settings: { foreground: "#8b888f" },
    },
    {
      scope: ["markup.heading", "entity.name.section"],
      settings: { foreground: "#fce566" },
    },
    {
      scope: ["markup.underline.link", "markup.inserted"],
      settings: { foreground: "#7bd88f" },
    },
    {
      scope: ["markup.deleted"],
      settings: { foreground: "#fc618d" },
    },
    {
      scope: ["markup.changed"],
      settings: { foreground: "#fce566" },
    },
    {
      scope: ["invalid"],
      settings: { foreground: "#fc618d", fontStyle: "italic underline" },
    },
  ],
};

export { sun as monokaiSun, spectrum as monokaiSpectrum };
