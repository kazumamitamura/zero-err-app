import Link from "next/link";

/**
 * 全ページ共通ヘッダー。Zero-Err ロゴを押すとホーム（大カード2つの画面）に戻れる。
 * ADHD 傾向を考慮した「迷わない・安心して戻れる」設計。
 */
export function ZeHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center px-4 py-4">
        <Link
          href="/"
          className="text-xl font-bold text-slate-800 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded"
        >
          Zero-Err
        </Link>
      </div>
    </header>
  );
}
