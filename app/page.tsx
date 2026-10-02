import Link from "next/link";
import { createGroup, createJudge, deleteJudge, updateJudge } from "./actions";
import { ConfirmButton } from "@/components/ConfirmButton";
import { getDashboardData } from "@/lib/data";
import { formatScore } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { groups, judges, totalJudges } = await getDashboardData();
  return (
    <main className="container">
      <div className="page-heading">
        <div><span className="eyebrow">Youth-led Dialogue</span><h1>Tổng quan chấm điểm</h1><p>Theo dõi tiến độ nhập phiếu và các chỉ số tổng hợp.</p></div>
        <div className="actions"><Link className="button primary" href="/scores">Nhập điểm BGK</Link><Link className="button ghost" href="/results">Xem kết quả</Link></div>
      </div>
      <div className="grid-2">
        <section className="stack">
          <div className="section-heading"><div><span className="eyebrow">Danh sách</span><h2>{groups.length} nhóm dự thi</h2></div></div>
          <div className="table-wrap">
            <table><thead><tr><th>Nhóm</th><th>Tiến độ BGK</th><th className="number">Điểm nền</th><th className="number">Hình thức</th><th className="number">Truyền thông</th><th className="number">Voting</th><th className="number">Ấn tượng</th></tr></thead>
              <tbody>{groups.map((group) => <tr key={group.id}><td><Link className="group-name" href={`/groups/${group.id}`}>{group.name}<small>{group.initiative}</small></Link></td><td><span className={`badge ${group.isComplete ? "complete" : group.aggregate.scoreCount ? "partial" : "empty"}`}>{group.aggregate.scoreCount}/{totalJudges} BGK</span>{!group.isComplete && <div className="warning">Chưa đủ phiếu chấm</div>}</td><td className="number">{group.isComplete ? formatScore(group.aggregate.averageBackground) : "—"}</td><td className="number">{group.isComplete ? formatScore(group.aggregate.averagePresentation) : "—"}</td><td className="number">{group.mediaScore}</td><td className="number">{group.directVotingScore}</td><td className="number"><strong>{group.impressionScore}</strong></td></tr>)}</tbody>
            </table>
            {groups.length === 0 && <div className="empty-state">Chưa có nhóm. Tạo nhóm đầu tiên ở biểu mẫu bên cạnh.</div>}
          </div>
        </section>
        <aside className="stack">
          <section className="card"><div className="section-heading"><div><span className="eyebrow">Quản lý nhóm</span><h2>Thêm nhóm mới</h2></div></div><form action={createGroup} className="form-grid"><label className="field">Tên nhóm<input name="name" required pattern=".*\S.*" title="Vui lòng nhập tên nhóm." /></label><label className="field">Tên sáng kiến / vấn đề<input name="initiative" required pattern=".*\S.*" title="Vui lòng nhập tên sáng kiến." /></label><label className="field">Ghi chú<textarea name="notes" /></label><button className="button primary">+ Thêm nhóm</button></form></section>
          <section className="card"><div className="section-heading"><div><span className="eyebrow">Ban Giám khảo</span><h2>{judges.length} BGK</h2></div></div><form action={createJudge} className="judge-item"><input name="name" required pattern=".*\S.*" title="Vui lòng nhập họ tên BGK." placeholder="Họ tên BGK" /><button className="button primary">+ Thêm</button></form>{judges.map((judge) => <form action={updateJudge} className="judge-item" key={judge.id}><input type="hidden" name="id" value={judge.id} /><input type="text" name="name" required pattern=".*\S.*" title="Vui lòng nhập họ tên BGK." defaultValue={judge.name} /><button className="button secondary">Lưu</button><ConfirmButton action={deleteJudge}>Xóa</ConfirmButton></form>)}</section>
        </aside>
      </div>
    </main>
  );
}
