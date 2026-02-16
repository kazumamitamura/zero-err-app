# Zero-Err 実装設計図（Plan）

.cursorrules に基づく実装ステップ。

---

## ステップ1：ルール・スタック定義
- 命名規則（ze_ 接頭辞）、Feature-First 構成、UX 方針、技術スタックの確定。
- 参照: .cursorrules / .cursor/rules/zero-err-app.mdc

---

## ステップ2：Project scaffold（ファイル作成）

### 2.1 ルート設定
| ファイル | 役割 |
|----------|------|
| `package.json` | Next.js 14, Supabase, Tailwind, RHF, Zod, Lucide 依存関係 |
| `tsconfig.json` | TypeScript + path `@/*` |
| `next.config.js` | Next.js 設定 |
| `tailwind.config.ts` | Tailwind（content に src/features を含める） |
| `postcss.config.js` | PostCSS |
| `next-env.d.ts` | Next 型参照 |
| `.env.local.example` | Supabase 環境変数例 |

### 2.2 App Router（Next.js 14）
| ファイル | 役割 |
|----------|------|
| `src/app/layout.tsx` | ルートレイアウト、globals.css 読込 |
| `src/app/globals.css` | Tailwind ディレクティブ |
| `src/app/page.tsx` | ホーム：大カード「Use Template」「Create New」 |
| `src/app/templates/page.tsx` | テンプレート一覧・選択 |
| `src/app/templates/new/page.tsx` | 新規テンプレート作成（枠のみ） |

### 2.3 Feature: ze_templates
| ファイル | 役割 |
|----------|------|
| `src/features/ze_templates/types.ts` | ZeTemplate, ZeContentSchema, ZeSchemaField |
| `src/features/ze_templates/ZeTemplateCard.tsx` | テンプレートカード UI |
| `src/features/ze_templates/index.ts` | 公開 export |

### 2.4 Feature: ze_generator
| ファイル | 役割 |
|----------|------|
| `src/features/ze_generator/zeReplacePlaceholders.ts` | {{key}} 置換ロジック |
| `src/features/ze_generator/ZeGeneratorWizard.tsx` | ウィザード：入力 → 生成 → 読取専用結果 |
| `src/features/ze_generator/index.ts` | 公開 export |

### 2.5 Feature: ze_auth
| ファイル | 役割 |
|----------|------|
| `src/features/ze_auth/useZeAuth.ts` | 認証状態フック |
| `src/features/ze_auth/index.ts` | 公開 export |

### 2.6 共通ライブラリ
| ファイル | 役割 |
|----------|------|
| `src/lib/supabase/client.ts` | ブラウザ用 Supabase クライアント |
| `src/lib/supabase/server.ts` | サーバー用 Supabase クライアント（Cookie） |
| `src/types/database.ts` | DB 行型（ZeTemplateRow 等） |

---

## ステップ3：Database（マイグレーション）

### 3.1 マイグレーションファイル
| ファイル | 役割 |
|----------|------|
| `supabase/migrations/001_ze_templates.sql` | ze_templates テーブル + RLS |

### 3.2 スキーマ（ze_templates）
- `id` uuid PK
- `owner_id` uuid NOT NULL → auth.users(id) ON DELETE CASCADE
- `title` text NOT NULL
- `content_schema` jsonb NOT NULL（入力フィールド定義）
- `fixed_text` text NOT NULL（{{placeholder}} 付き本文）
- `is_public` boolean NOT NULL DEFAULT false
- `category` text（フォルダ分類用）

### 3.3 RLS
- **SELECT:** `auth.uid() = owner_id` OR `is_public = true`
- **INSERT / UPDATE / DELETE:** `auth.uid() = owner_id` のみ（他者の public は編集不可）

---

## 以降のステップ（参考）
- ステップ4: Supabase からテンプレート取得・一覧表示
- ステップ5: 新規テンプレート作成フォーム（Zod + RHF、オートセーブ）
- ステップ6: 認証 UI（ログイン・プロフィール）
