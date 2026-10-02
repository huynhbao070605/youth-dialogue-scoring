import { MediaRow } from "@/components/MediaRow";
import { getDashboardData } from "@/lib/data";
import { prisma } from "@/lib/db";
import { updateTargetTime } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const [{ groups }, setting] = await Promise.all([
    getDashboardData(),
    prisma.setting.findUnique({ where: { id: 1 } }),
  ]);
  const target = setting?.targetPresentationSeconds;
  return (
    <main className="container">
      <div className="page-heading"><div><span className="eyebrow">Dữ liệu sự kiện</span><h1>Truyền thông & Voting</h1><p>Điểm truyền thông và ấn tượng được tự động tính từ số liệu gốc.</p></div></div>
      <section className="card" style={{ marginBottom: 18 }}>
        <form action={updateTargetTime} className="selector">
          <div><span className="eyebrow">Cấu hình tie-break</span><h2 style={{ margin: "4px 0" }}>Thời lượng trình bày quy định</h2><p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>Để trống nếu chương trình chưa chốt thời lượng.</p></div>
          <div className="duration"><input name="targetMinutes" type="number" min="0" step="1" defaultValue={target == null ? "" : Math.floor(target / 60)} placeholder="phút" /><span>:</span><input name="targetSeconds" type="number" min="0" max="59" step="1" defaultValue={target == null ? "" : target % 60} placeholder="giây" /></div>
          <button className="button secondary">Lưu cấu hình</button>
        </form>
      </section>
      <div className="table-wrap media-form">
        <table><thead><tr><th>Nhóm</th><th>Like</th><th>Comment</th><th>Share × 3</th><th>Truyền thông</th><th>Voting</th><th>Ấn tượng</th><th>Thời gian</th><th></th></tr></thead><tbody>{groups.map((group) => <MediaRow key={group.id} id={group.id} name={group.name} initial={{ likes: group.likes, comments: group.comments, shares: group.shares, directVotingScore: group.directVotingScore, presentationDurationSeconds: group.presentationDurationSeconds }} />)}</tbody></table>
        {groups.length === 0 && <div className="empty-state">Chưa có nhóm để nhập dữ liệu.</div>}
      </div>
    </main>
  );
}
