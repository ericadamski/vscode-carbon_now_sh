"use strict";

import {
  Range,
  ExtensionContext,
  commands,
  window,
  workspace,
  env,
  Uri,
} from "vscode";
import { URL } from "url";

function getLanguage(languageId: string) {
  const languageMap = new Map([
    ["shellscript", "application/x-sh"],
    ["plaintext", "text"],
    ["c", "text/x-csrc"],
    ["cpp", "text/x-c++src"],
    ["csharp", "text/x-csharp"],
    ["clojure", "clojure"],
    ["coffeescript", "coffeescript"],
    ["css", "css"],
    ["dart", "dart"],
    ["diff", "text/x-diff"],
    ["dockerfile", "dockerfile"],
    ["elixir", "elixir"],
    ["elm", "elm"],
    ["erlang", "erlang"],
    ["fortran", "fortran"],
    ["fsharp", "mllike"],
    ["graphql", "graphql"],
    ["go", "go"],
    ["groovy", "groovy"],
    ["handlebars", "handlebars"],
    ["haskell", "haskell"],
    ["haxe", "haxe"],
    ["html", "htmlmixed"],
    ["java", "text/x-java"],
    ["javascript", "javascript"],
    ["json", "application/json"],
    ["javascriptreact", "jsx"],
    ["typescriptreact", "text/typescript-jsx"],
    ["julia", "julia"],
    ["kotlin", "text/x-kotlin"],
    ["latex", "stex"],
    ["lisp", "commonlisp"],
    ["lua", "lua"],
    ["markdown", "markdown"],
    ["wolfram", "mathematica"],
    ["matlab", "text/x-octave"],
    ["octave", "text/x-octave"],
    ["sql", "text/x-mysql"],
    ["NGINX", "nginx"],
    ["objective-c", "text/x-objectivec"],
    ["ocaml", "mllike"],
    ["pascal", "pascal"],
    ["perl", "perl"],
    ["php", "text/x-php"],
    ["powershell", "powershell"],
    ["python", "python"],
    ["r", "r"],
    ["ruby", "ruby"],
    ["rust", "rust"],
    ["sass", "sass"],
    ["scala", "text/x-scala"],
    ["smalltalk", "smalltalk"],
    ["stylus", "stylus"],
    ["swift", "swift"],
    ["tcl", "tcl"],
    ["toml", "toml"],
    ["typescript", "application/typescript"],
    ["vb", "vb"],
    ["verilog", "verilog"],
    ["vhdl", "vhdl"],
    ["vue", "vue"],
    ["xml", "xml"],
    ["yaml", "yaml"],
  ]);

  if (languageMap.has(languageId)) {
    return languageMap.get(languageId);
  } else {
    return "auto";
  }
}

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand("carbon.show", () => {
    const editor = window.activeTextEditor;

    if (!editor) return window.showErrorMessage("😱 Feed me code!");

    const { languageId, lineAt, getText } = editor.document;
    const settings = workspace.getConfiguration("carbon");
    const language = getLanguage(languageId);

    const { start, end, active } = editor.selection;

    const selection = (start.isEqual(end)
      ? lineAt(active.line).text
      : getText(new Range(start, end))
    ).trim();

    const maxCharacterLength = 1000;
    if (selection.length > maxCharacterLength)
      return window.showErrorMessage(
        `Selected code is longer than ${maxCharacterLength} characters, refusing to send to carbon.`
      );

    const url = new URL(settings.get("url"));

    if (settings.get("useBrowserCache")) {
      url.searchParams.set("code", encodeURIComponent(selection));
      context.subscriptions.push(disposable);
    } else {
      url.searchParams.set("bg", settings.get("backgroundColor"));
      url.searchParams.set("t", settings.get("theme"));
      url.searchParams.set("wt", settings.get("windowTheme"));
      url.searchParams.set("l", language);
      url.searchParams.set("ds", settings.get("dropShadow"));
      url.searchParams.set("dsyoff", `${settings.get("dropShadowOffset")}px`);
      url.searchParams.set(
        "dsblur",
        `${settings.get("dropShadowBlurRadius")}px`
      );
      url.searchParams.set("wc", settings.get("windowControls"));
      url.searchParams.set("wa", settings.get("autoAdjustWidth"));
      url.searchParams.set("pv", `${settings.get("paddingVertical")}px`);
      url.searchParams.set("ph", `${settings.get("paddingHorizontal")}px`);
      url.searchParams.set("ln", settings.get("lineNumbers"));
      url.searchParams.set("f", settings.get("fontFamily"));
      url.searchParams.set("fs", `${settings.get("fontSize")}px`);
      url.searchParams.set("lh", `${settings.get("lineHeight")}%`);
      url.searchParams.set("wm", settings.get("showWatermark"));
      url.searchParams.set("ts", settings.get("timestamp"));
      url.searchParams.set("es", settings.get("exportSize"));
      url.searchParams.set("code", encodeURIComponent(selection));
    }

    open(Uri.parse(url.toString())).catch((err) => {
      window.showErrorMessage("Failed to open browser", err);
      console.error("Failed to open browser", err);
    });
  });

  context.subscriptions.push(disposable);
}

const open = async (uri: Uri) => {
  return await env.openExternal(uri);
};

export function deactivate() {}
