/* Babylon Lite 学習ページ 共通の図解レンダラ
 * mermaid を CDN から読み込み、window.MERMAID_DEFS の各定義を描画する。
 * 定義値の %%TOKEN%% は現在のテーマの CSS 変数に置換され、
 * テーマ切り替え・OS のダーク設定変更に追従して再描画する。
 */
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.16.0/+esm";

var root = document.documentElement;
var DEFS = window.MERMAID_DEFS || {};

function cssv(name, fb) {
  var x = getComputedStyle(root).getPropertyValue(name).trim();
  return x || fb;
}

function tokens(def) {
  return def
    .replace(/%%SURFACE%%/g, cssv("--surface", "#ffffff"))
    .replace(/%%ACCENT%%/g, cssv("--accent", "#e24a32"))
    .replace(/%%TIP%%/g, cssv("--tip", "#2e9e6b"))
    .replace(/%%WARN%%/g, cssv("--warn", "#c57a1e"))
    .replace(/%%SUP%%/g, cssv("--support", "#2563eb"))
    .replace(/%%MUTED%%/g, cssv("--muted", "#697485"))
    .replace(/%%INK%%/g, cssv("--ink", "#171a21"))
    .replace(/%%BORDER%%/g, cssv("--border", "#dce1e9"));
}

function config() {
  var font = cssv("--font-sans", "system-ui, sans-serif");
  return {
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    fontFamily: font,
    flowchart: { htmlLabels: true, curve: "basis", padding: 10, useMaxWidth: true },
    themeVariables: {
      fontFamily: font,
      fontSize: "14px",
      background: cssv("--surface-2", "#f7f9fb"),
      primaryColor: cssv("--surface", "#ffffff"),
      primaryTextColor: cssv("--ink", "#171a21"),
      primaryBorderColor: cssv("--border", "#dce1e9"),
      secondaryColor: cssv("--surface-2", "#f7f9fb"),
      tertiaryColor: cssv("--surface-2", "#f7f9fb"),
      lineColor: cssv("--muted", "#697485"),
      textColor: cssv("--ink", "#171a21"),
      clusterBkg: "transparent",
      clusterBorder: cssv("--border", "#dce1e9"),
      edgeLabelBackground: cssv("--surface-2", "#f7f9fb")
    }
  };
}

var seq = 0, rendering = false;
async function renderAll() {
  if (rendering) return;
  rendering = true;
  try {
    mermaid.initialize(config());
    for (var id in DEFS) {
      var host = document.getElementById(id);
      if (!host) continue;
      try {
        var res = await mermaid.render(id + "__r" + (++seq), tokens(DEFS[id]));
        host.innerHTML = res.svg;
      } catch (e) {
        host.innerHTML = '<p class="mmd-err">図の描画に失敗しました（mermaid の読み込みを確認してください）。</p>';
        console.error("[mermaid]", id, e);
      }
    }
  } finally {
    rendering = false;
  }
}

renderAll();
// 再描画：テーマ切り替え（data-theme）や OS のダーク設定変更に追従
new MutationObserver(function () { renderAll(); })
  .observe(root, { attributes: true, attributeFilter: ["data-theme"] });
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { renderAll(); });
