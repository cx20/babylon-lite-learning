# Babylon Lite 学習ページ

WebGPU 専用の軽量 3D エンジン **[Babylon Lite](https://github.com/BabylonJS/Babylon-Lite)** を、初学者向けにやさしく解説する学習ページです。

## 開き方

`index.html` をブラウザで開きます。3 つのフロー図は [mermaid](https://mermaid.js.org/) を CDN から読み込んで描画するため、**インターネット接続**があると確実です（オフラインでもカメラの図やコード・本文は表示されます）。ローカルで確認する場合は、簡易サーバー経由が最も安定します。

```bash
# 例：このフォルダで簡易サーバーを起動
python -m http.server 8000
# → http://localhost:8000 を開く
```

- WebGPU 対応ブラウザ（Chrome / Edge 113+ など）を推奨します。
- ページ内のサンプルコードは、そのまま [Lite Playground](https://liteplayground.babylonjs.com/) に貼り付けて動かせます。

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | ページ本体（マークアップ） |
| `styles.css` | スタイル（ライト/ダーク両テーマ対応） |
| `assets/arc-rotate-camera.svg` | カメラ引数の図（テーマ対応の外部 SVG） |

### 図解について

- **フロー/構造の 3 図**（ツリーシェイク・シーンの所有・登録の順序）は **mermaid 記法**で記述し、`https://cdn.jsdelivr.net/npm/mermaid@11.16.0/+esm` から ESM で読み込んで描画します。ページのテーマ切り替えに追従して再描画します。
- **カメラの幾何図**（α/β/radius/target）は mermaid では表現しにくいため、独立した **SVG ファイル**にしています。`prefers-color-scheme` でダークモードに追従します。

## 内容

1. Babylon Lite とは（Babylon.js との違い）
2. 動作要件
3. まず押さえたい 4 つの考え方（プレーンデータ / シーンが所有者 / 明示的なライフサイクル / 使った分だけ）
4. ライフサイクル（作成 → 追加 → 登録 → 開始）
5. Playground の使い方
6. サンプルコード集（4 本・コピー可）
7. Babylon.js → Lite API 早見表
8. 初学者がつまづきやすいところ
9. 次のステップ・参考リンク

## 参考

- [BabylonJS/Babylon-Lite](https://github.com/BabylonJS/Babylon-Lite) — 本体と公式ドキュメント（`docs/lite/`）
- [Lite Playground](https://liteplayground.babylonjs.com/) — ブラウザだけで試せる公式エディタ
- [Babylon Lite 公式ページ](https://www.babylonjs.com/lite/)
- [cx20/babylon-lite-demo-guide](https://github.com/cx20/babylon-lite-demo-guide) — 公式デモの日本語解説
