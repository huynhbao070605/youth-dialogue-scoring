import { prisma } from "@/lib/db";
import { ScoreForm } from "@/components/ScoreForm";
import type { ScoreValues } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function ScoresPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const [groups, judges] = await Promise.all([
    prisma.group.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.judge.findMany({ orderBy: { createdAt: "asc" } }),
  ]);
  const groupId = typeof query.groupId === "string" ? query.groupId : groups[0]?.id;
  const judgeId = typeof query.judgeId === "string" ? query.judgeId : judges[0]?.id;
  const selectedGroup = groups.find((group) => group.id === groupId);
  const selectedJudge = judges.find((judge) => judge.id === judgeId);
  const score = groupId && judgeId ? await prisma.score.findUnique({ where: { groupId_judgeId: { groupId, judgeId } } }) : null;
  const initial: ScoreValues | null = score ? { coreProblem: score.coreProblem, problemTreeLogic: score.problemTreeLogic, localEvidence: score.localEvidence, feasibility: score.feasibility, youthRole: score.youthRole, solutionStructure: score.solutionStructure, visualLayout: score.visualLayout, presentation: score.presentation, qa: score.qa } : null;

  return (
    <main className="container">
      <div className="page-heading"><div><span className="eyebrow">Phiếu giấy → Website</span><h1>Nhập điểm Ban Giám khảo</h1><p>Chọn nhóm và BGK, sau đó nhập 9 điểm thành phần.</p></div></div>
      <form method="get" className="card selector">
        <label className="field">Nhóm<select name="groupId" defaultValue={groupId}>{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>
        <label className="field">Ban Giám khảo<select name="judgeId" defaultValue={judgeId}>{judges.map((judge) => <option key={judge.id} value={judge.id}>{judge.name}</option>)}</select></label>
        <button className="button secondary">Mở phiếu</button>
      </form>
      <div style={{ height: 18 }} />
      {query.saved === "1" && <div className="notice">Đã lưu phiếu điểm.</div>}
      {selectedGroup && selectedJudge ? <><div className="section-heading"><div><span className="eyebrow">{selectedJudge.name}</span><h2>{selectedGroup.name} — {selectedGroup.initiative}</h2></div></div><ScoreForm key={`${selectedGroup.id}:${selectedJudge.id}:${score?.updatedAt.toISOString() ?? "new"}`} groupId={selectedGroup.id} judgeId={selectedJudge.id} initial={initial} /></> : <div className="card empty-state">Cần tạo ít nhất một nhóm và một BGK trước khi nhập điểm.</div>}
    </main>
  );
}
