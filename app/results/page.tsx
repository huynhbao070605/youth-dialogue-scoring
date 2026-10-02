import { getDashboardData, toGroupResult } from "@/lib/data";
import { prisma } from "@/lib/db";
import { formatScore } from "@/lib/format";
import { allocateAwards, type AwardResult, type TieBreaker } from "@/lib/scoring";

export const dynamic = "force-dynamic";

const breakerLabels: Partial<Record<TieBreaker, string>> = {
  averageBackground: "Điểm nền trung bình",
  averageFeasibility: "Khả năng thực thi",
  averageYouthRole: "Vai trò thanh thiếu niên",
  averageQa: "Phần hỏi – đáp",
  timeCompliance: "Tuân thủ thời gian trình bày",
};

export default async function ResultsPage() {
  const [data, setting] = await Promise.all([
    getDashboardData(),
    prisma.setting.findUnique({ where: { id: 1 } }),
  ]);
  const complete = data.groups.filter((group) => group.isComplete);
  const ready = data.groups.length === 5 && complete.length === 5;
  const allocation = allocateAwards(
    ready ? complete.map(toGroupResult) : [],
    setting?.targetPresentationSeconds,
  );
  const waitingMessage = ready
    ? "Chờ BTC/BGK quyết định giải trước."
    : data.groups.length !== 5
      ? "Cần đúng 5 nhóm để phân bổ giải."
      : "Chưa đủ phiếu BGK để xác định.";
  const results = [
    {
      title: "Sáng kiến Toàn diện",
      primary: "averageBackground" as TieBreaker,
      result: allocation.comprehensive,
      metric: (id: string) => data.groups.find((group) => group.id === id)?.aggregate.averageBackground ?? null,
      metricLabel: "Điểm nền TB",
    },
    {
      title: "Tiếng nói Thanh niên",
      primary: "averagePresentation" as TieBreaker,
      result: allocation.youthVoice,
      metric: (id: string) => data.groups.find((group) => group.id === id)?.aggregate.averagePresentation ?? null,
      metricLabel: "Hình thức TB",
    },
    {
      title: "Sáng kiến Ấn tượng",
      primary: "directVotingScore" as TieBreaker,
      result: allocation.galleryWalk,
      metric: (id: string) => data.groups.find((group) => group.id === id)?.directVotingScore ?? null,
      metricLabel: "Gallery Walk / Voting",
    },
    {
      title: "Tiếng nói Ấn tượng",
      primary: "mediaScore" as TieBreaker,
      result: allocation.mediaVoice,
      metric: (id: string) => data.groups.find((group) => group.id === id)?.mediaScore ?? null,
      metricLabel: "Điểm truyền thông",
    },
    {
      title: "Sáng kiến Tiềm năng",
      primary: null,
      result: allocation.potential,
      metric: () => null,
      metricLabel: null,
    },
  ];

  return (
    <main className="container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Phân bổ tuần tự</span>
          <h1>Kết quả giải thưởng</h1>
          <p>Mỗi nhóm nhận tối đa một giải theo đúng thứ tự xét giải.</p>
        </div>
      </div>
      {!ready && data.groups.length > 0 && (
        <div className="notice" style={{ background: "#fff5d7", color: "#845d00" }}>
          {waitingMessage}
        </div>
      )}
      <section className="award-grid">
        {results.map((item) => (
          <AwardCard key={item.title} {...item} groups={data.groups} emptyMessage={waitingMessage} />
        ))}
      </section>
    </main>
  );
}

function AwardCard({
  title,
  primary,
  result,
  groups,
  metric,
  metricLabel,
  emptyMessage,
}: {
  title: string;
  primary: TieBreaker | null;
  result: AwardResult;
  groups: Array<{ id: string; name: string }>;
  metric: (id: string) => number | null;
  metricLabel: string | null;
  emptyMessage: string;
}) {
  const winners = result.winnerIds
    .map((id) => groups.find((group) => group.id === id))
    .filter(Boolean) as Array<{ id: string; name: string }>;
  const usedTieBreak = result.decidedBy && result.decidedBy !== primary;

  return (
    <article className="card award-card">
      <span className="eyebrow">Giải thưởng</span>
      <h2>{title}</h2>
      {result.status === "no_data" ? (
        <p className="metric">{emptyMessage}</p>
      ) : result.status === "manual_decision_required" ? (
        <>
          <div className="manual">Cần BTC/BGK quyết định</div>
          <p className="metric">Các nhóm đang chờ phân bổ: {winners.map((group) => group.name).join(", ")}</p>
        </>
      ) : (
        <>
          <div className="winner">{winners[0]?.name}</div>
          {metricLabel && (
            <div className="metric">{metricLabel}: <strong>{formatScore(metric(winners[0].id))}</strong></div>
          )}
          {usedTieBreak && (
            <div className="decision">Tie-break: <strong>{breakerLabels[result.decidedBy!]}</strong></div>
          )}
        </>
      )}
    </article>
  );
}
