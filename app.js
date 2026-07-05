/* Babylon Lite 学習ページ 共通スクリプト
 * - テーマ切り替え
 * - シンタックスハイライト（TypeScript / Babylon Lite API）
 * - コードのコピー
 * - 図の拡大モーダル（100% / 150% / 200% ・ ESC で閉じる）
 * ページ固有の演出（ヒーローの Canvas 等）は各ページ側に置く。
 */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- theme toggle ---------- */
  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      if (!current) {
        current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      root.setAttribute("data-theme", current === "dark" ? "light" : "dark");
    });
  }

  /* ---------- syntax highlight ---------- */
  var KW = /\b(import|from|const|let|var|await|async|function|return|new|as|of|in|for|if|else)\b/g;
  var FN = /\b(createEngine|createSceneContext|createArcRotateCamera|createDefaultCamera|createFreeCamera|attachControl|attachFreeControl|createHemisphericLight|createDirectionalLight|createPointLight|createSpotLight|createSphere|createBox|createGround|createCylinder|createPlane|createStandardMaterial|createPbrMaterial|createGridMaterial|createShaderMaterial|setShaderUniform|setShaderFloat|setShaderVector3|setShaderTexture|createTransformNode|cloneTransformNode|addToScene|removeFromScene|registerSceneWithShadowSupport|registerScene|unregisterScene|startEngine|disposeScene|disposeEngine|onBeforeRender|loadGltf|loadEnvironment|loadHdrEnvironment|loadTexture2D|loadSpriteAtlas|createGridSpriteAtlas|createSpriteRenderer|createRenderTexture2D|setThinInstanceColors|setThinInstances|addThinInstance|setThinInstanceMatrix|flushThinInstances|enableThinInstanceGpuCulling|createGpuPicker|enableDetailedPicking|getPickedNormal|getPickedUV|createEsmDirectionalShadowGenerator|createPcfDirectionalShadowGenerator|createPcfSpotlightShadowGenerator|setShadowTaskCasterMeshes|createBloomPostProcessTask|createBlurPostProcessTask|createFrameGraphContext|markMaterialUboDirty)\b/g;

  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  // control-char markers that never appear in source code
  var M0 = String.fromCharCode(1), M1 = String.fromCharCode(2);
  var STR_RE = /"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g;
  var COM_RE = /\/\/[^\n]*/g;
  var HOLD_RE = new RegExp(M0 + '(\\d+)' + M1, 'g');

  function highlight(raw) {
    var store = [];
    function hold(html) { store.push(html); return M0 + (store.length - 1) + M1; }
    var s = esc(raw);
    // strings FIRST, so a "//" inside a URL is never mistaken for a comment
    s = s.replace(STR_RE, function (m) { return hold('<span class="tk-str">' + m + '</span>'); });
    s = s.replace(COM_RE, function (m) { return hold('<span class="tk-com">' + m + '</span>'); });
    s = s.replace(KW, '<span class="tk-kw">$1</span>');
    s = s.replace(FN, '<span class="tk-fn">$1</span>');
    s = s.replace(HOLD_RE, function (_, i) { return store[Number(i)]; });
    return s;
  }

  var blocks = document.querySelectorAll("pre code");
  for (var i = 0; i < blocks.length; i++) {
    var el = blocks[i];
    el.setAttribute("data-raw", el.textContent);
    el.innerHTML = highlight(el.textContent);
  }

  /* ---------- copy buttons ---------- */
  var copies = document.querySelectorAll(".copy");
  for (var j = 0; j < copies.length; j++) {
    copies[j].addEventListener("click", function (e) {
      var btn = e.currentTarget;
      var code = btn.closest(".code").querySelector("pre code");
      var text = code.getAttribute("data-raw") || code.textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = "コピーしました ✓";
        btn.classList.add("done");
        setTimeout(function () { btn.textContent = "コピー"; btn.classList.remove("done"); }, 1600);
      }).catch(function () {
        btn.textContent = "失敗";
        setTimeout(function () { btn.textContent = "コピー"; }, 1600);
      });
    });
  }

  /* ---------- 図の拡大モーダル（100% / 150% / 200% ・ ESC で閉じる） ---------- */
  var modal = document.getElementById("figModal");
  var modalBody = document.getElementById("figModalBody");
  var scaleSel = document.getElementById("figModalScale");
  var lastFocus = null, curItems = [];

  function applyScale() {
    var pct = parseInt(scaleSel.value, 10) || 150;
    for (var i = 0; i < curItems.length; i++) {
      var it = curItems[i];
      it.node.style.maxWidth = "none";
      it.node.style.width = Math.round(it.baseW * pct / 100) + "px";
      it.node.style.height = "auto";
    }
  }

  function openFig(fig, trigger) {
    // 描画済みの図（mermaid の SVG は複数可・またはカメラ等の img）を複製して拡大表示
    var svgs = fig.querySelectorAll(".mermaid svg");
    var img = fig.querySelector("img.fig-img");
    var srcs = svgs.length ? svgs : (img ? [img] : []);
    if (!srcs.length) return;
    lastFocus = trigger || null;
    modalBody.innerHTML = "";
    curItems = [];
    for (var i = 0; i < srcs.length; i++) {
      var w = srcs[i].getBoundingClientRect().width || 720;
      var clone = srcs[i].cloneNode(true);
      modalBody.appendChild(clone);
      curItems.push({ node: clone, baseW: w });
    }
    scaleSel.value = "150";
    applyScale();
    showModal();
  }

  function showModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var closeBtn = modal.querySelector(".fig-modal__close");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalBody.innerHTML = "";
    curItems = [];
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (modal) {
    scaleSel.addEventListener("change", applyScale);
    modal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-fig-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
    var figures = document.querySelectorAll(".figure");
    for (var fi = 0; fi < figures.length; fi++) {
      (function (fig) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fig-zoom";
        btn.textContent = "⤢ 拡大";
        btn.setAttribute("aria-label", "この図を拡大表示する");
        btn.addEventListener("click", function () { openFig(fig, btn); });
        fig.appendChild(btn);
      })(figures[fi]);
    }
  }
})();
