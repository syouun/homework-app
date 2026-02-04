# 匠真向けの宿題管理アプリ (Homework Management for Syouma)

親子のための、楽しく宿題を管理できるWebアプリケーションです。
「クエスト」として宿題をこなし、AI先生が優しくヒントを教えてくれます。

## 主な機能

### 👨‍👩‍👧 親向け (管理者)
- **タスク管理**: 宿題（クエスト）の作成・編集・削除。
- **科目設定**: タスクごとに科目（算数、国語など）を設定可能。
- **AI先生の設定**: 子供の学年（小1〜中3）に合わせて、AIの口調や指導レベルを調整できます。
- **読書記録**: 読んだ本の管理。

### 👦 子供向け (プレイヤー)
- **クエスト一覧**: GamificationされたUIで宿題を確認。期限が近づくとアラート表示。
- **AI先生 (Sensei)**: 「答えを教えない」優しいAI先生にチャットで質問できます。
    - 低学年ならひらがなで優しく、高学年なら少し論理的にサポートします。
    - Google Gemini 2.5 Flash を使用しています。
- **できた！ボタン**: タスクを完了して達成感を味わえます。
- **図書室**: 読んだ本の一覧を確認。

## 技術スタック

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: Google Generative AI SDK (Gemini 2.5 Flash)
- **Styling**: Tailwind CSS

## セットアップ手順

1.  **リポジトリのクローン**
    ```bash
    git clone <repository-url>
    cd homework-app
    ```

2.  **依存関係のインストール**
    ```bash
    npm install
    ```

3.  **環境変数の設定**
    `.env.local` ファイルを作成し、以下を設定してください。
    ```env
    DATABASE_URL="postgresql://..."
    GEMINI_API_KEY="AIza..."
    NEXTAUTH_SECRET="..."
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **データベースのセットアップ**
    ```bash
    npx prisma migrate dev
    npx prisma db seed # 初期データの投入（ユーザー作成など）
    ```

5.  **開発サーバーの起動**
    ```bash
    npm run dev
    ```

## ログイン情報 (開発用)
- **親アカウント**:
    - ID: `parent`
    - Pass: `password123`
- **子供アカウント**:
    - ID: `shoma`
    - Pass: `shoma123`
