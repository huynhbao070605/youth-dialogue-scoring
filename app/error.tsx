"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container">
      <section className="card empty-state">
        <h1>Không thể lưu thay đổi</h1>
        <p>Dữ liệu không hợp lệ hoặc bản ghi đã được thay đổi. Vui lòng kiểm tra và thử lại.</p>
        <button className="button primary" onClick={reset}>Thử lại</button>
      </section>
    </main>
  );
}
