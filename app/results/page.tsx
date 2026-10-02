import { PotentialForm } from "@/components/PotentialForm";
import { getDashboardData, toGroupResult } from "@/lib/data";
import { prisma } from "@/lib/db";
import { formatScore } from "@/lib/format";
import { rankComprehensiveAward, rankImpressionAward, rankYouthVoiceAward, type AwardResult, type TieBreaker } from "@/lib/scoring";

export const dynamic = "force-dynamic";

const breakerLabels: Partial<Record<TieBreaker, string>> = {
  averageBackground: "Điểm nền trung bình",
  averageFeasibility: "Khả năng thực thi",
  averageYouthRole: "Vai trò thanh thiếu niên",
  averageQa: "Phần hỏi – đáp",
  timeCompliance: "Tuân thủ thời gian trình bày",
};

export default async function ResultsPage() {
  const [data, setting] = await Promise.all([getDashboardData(), prisma.setting.findUnique({ where: { id: 1 } })]);
  const complete = data.groups.filter((group) => group.isComplete);
  const candidates = complete.map(toGroupResult);
  const allBgkScoresComplete = data.groups.length > 0 && complete.length === data.groups.length;
  const impressionCandidates = data.groups.map((group) => {
    const candidate = toGroupResult(group);
    return group.isComplete ? candidate : { ...candidate, scoreCount: 0, backgroundTotal: 0 };
  });
  const results = [
    { title: "Sáng kiến Ấn tượng", primary: "impressionScore" as TieBreaker, result: rankImpressionAward(impressionCandidates), groups: data.groups, metric: (id: string) => data.groups.find((group) => group.id === id)?.impressionScore ?? null, metricLabel: "Điểm ấn tượng", emptyMessage: "Chưa có nhóm dự thi." },
    { title: "Sáng kiến Toàn diện", primary: "averageBackground" as TieBreaker, result: rankComprehensiveAward(allBgkScoresComplete ? candidates : [], setting?.targetPresentationSeconds), groups: complete, metric: (id: string) => complete.find((group) => group.id === id)?.aggregate.averageBackground ?? null, metricLabel: "Điểm nền TB", emptyMessage: "Chưa đủ phiếu BGK để xác định." },
    { title: "Tiếng nói Thanh niên", primary: "averagePresentation" as TieBreaker, result: rankYouthVoiceAward(allBgkScoresComplete ? candidates : [], setting?.targetPresentationSeconds), groups: complete, metric: (id: string) => complete.find((group) => group.id === id)?.aggregate.averagePresentation ?? null, metricLabel: "Hình thức TB", emptyMessage: "Chưa đủ phiếu BGK để xác định." },
  ];
  return (
    <main className="container">
      <div className="page-heading"><div><span className="eyebrow">Tổng hợp tự động</span><h1>Kết quả giải thưởng</h1><p>Kết quả dùng đầy đủ tie-break đã được quy định, không tự chọn khi vẫn hòa.</p></div></div>
      {!allBgkScoresComplete && data.groups.length > 0 && <div className="notice" style={{ background: "#fff5d7", color: "#845d00" }}>{data.groups.length - complete.length} nhóm chưa đủ phiếu BGK. Hai giải dựa trên điểm BGK chưa thể chốt; giải Ấn tượng vẫn xét từ truyền thông và voting.</div>}
      <section className="award-grid">{results.map((item) => <AwardCard key={item.title} {...item} />)}</section>
      <section className="card"><div className="section-heading"><div><span className="eyebrow">BTC lựa chọn thủ công</span><h2>Sáng kiến Tiềm năng</h2></div><span className="badge partial">Tối đa 02 nhóm</span></div><PotentialForm groups={data.groups.map((group) => ({ id: group.id, name: group.name, initiative: group.initiative, selected: group.isPotentialAward }))} /></section>
    </main>
  );
}

function AwardCard({ title, primary, result, groups, metric, metricLabel, emptyMessage }: { title: string; primary: TieBreaker; result: AwardResult; groups: Array<{ id: string; name: string }>; metric: (id: string) => number | null; metricLabel: string; emptyMessage: string }) {
  const winners = result.winnerIds.map((id) => groups.find((group) => group.id === id)).filter(Boolean) as Array<{ id: string; name: string }>;
  const usedTieBreak = result.decidedBy && result.decidedBy !== primary;
  return (
    <article className="card award-card">
      <span className="eyebrow">Giải thưởng</span><h2>{title}</h2>
      {result.status === "no_data" ? <p className="metric">{emptyMessage}</p> : result.status === "manual_decision_required" ? <><div className="manual">Cần BTC/BGK quyết định</div><p className="metric">Các nhóm đang hòa: {winners.map((group) => group.name).join(", ")}</p></> : <><div className="winner">{winners[0]?.name}</div><div className="metric">{metricLabel}: <strong>{formatScore(metric(winners[0].id))}</strong></div>{usedTieBreak && <div className="decision">Tie-break: <strong>{breakerLabels[result.decidedBy!]}</strong></div>}</>}
    </article>
  );
}
