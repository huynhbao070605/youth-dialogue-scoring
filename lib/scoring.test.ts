import { describe, expect, it } from "vitest";
import {
  aggregateScores,
  calculateImpressionScore,
  calculateMediaScore,
  calculateScoreTotals,
  rankComprehensiveAward,
  rankImpressionAward,
  rankYouthVoiceAward,
  type GroupResult,
  type ScoreValues,
} from "./scoring";

const sample: ScoreValues = {
  coreProblem: 5,
  problemTreeLogic: 4,
  localEvidence: 4,
  feasibility: 5,
  youthRole: 4,
  solutionStructure: 4,
  visualLayout: 5,
  presentation: 4,
  qa: 5,
};

const group = (overrides: Partial<GroupResult>): GroupResult => ({
  id: "a",
  name: "Nhóm A",
  scoreCount: 1,
  backgroundTotal: 20,
  presentationTotal: 16,
  feasibilityTotal: 4,
  youthRoleTotal: 4,
  qaTotal: 4,
  impressionScore: 100,
  presentationDurationSeconds: 300,
  ...overrides,
});

describe("công thức điểm", () => {
  it("tính tổng /25 và /20 từ 9 tiêu chí", () => {
    expect(calculateScoreTotals(sample)).toEqual({ background: 22, presentation: 18 });
  });

  it("tính điểm truyền thông với share nhân ba", () => {
    expect(calculateMediaScore(86, 24, 18)).toBe(164);
    expect(calculateImpressionScore(86, 24, 18, 25)).toBe(189);
  });

  it("giữ trung bình đầy đủ cho tổng và từng tiêu chí", () => {
    const aggregate = aggregateScores([sample, { ...sample, feasibility: 4, qa: 3 }]);
    expect(aggregate.averageBackground).toBe(21.5);
    expect(aggregate.averagePresentation).toBe(17);
    expect(aggregate.averageFeasibility).toBe(4.5);
    expect(aggregate.averageQa).toBe(4);
  });
});

describe("xếp giải", () => {
  it("giải Ấn tượng dùng điểm nền để phá hòa", () => {
    const result = rankImpressionAward([
      group({ id: "a", impressionScore: 120, backgroundTotal: 20 }),
      group({ id: "b", name: "Nhóm B", impressionScore: 120, backgroundTotal: 22 }),
    ]);
    expect(result.winnerIds).toEqual(["b"]);
    expect(result.decidedBy).toBe("averageBackground");
  });

  it("giải Ấn tượng không phá hòa bằng điểm nền chưa hoàn chỉnh", () => {
    const result = rankImpressionAward([
      group({ id: "a", impressionScore: 120, scoreCount: 0, backgroundTotal: 0 }),
      group({ id: "b", name: "Nhóm B", impressionScore: 120, backgroundTotal: 22 }),
    ]);
    expect(result.status).toBe("manual_decision_required");
  });

  it("ưu tiên điểm chính trước mọi tie-break", () => {
    const result = rankComprehensiveAward([
      group({ id: "a", backgroundTotal: 23, feasibilityTotal: 1, youthRoleTotal: 1 }),
      group({ id: "b", name: "Nhóm B", backgroundTotal: 22, feasibilityTotal: 5, youthRoleTotal: 5 }),
    ]);
    expect(result.winnerIds).toEqual(["a"]);
    expect(result.decidedBy).toBe("averageBackground");
  });

  it("giải Toàn diện lần lượt dùng khả thi, vai trò thanh niên và độ lệch thời gian", () => {
    const result = rankComprehensiveAward([
      group({ id: "a", backgroundTotal: 22, feasibilityTotal: 5, youthRoleTotal: 5, presentationDurationSeconds: 330 }),
      group({ id: "b", name: "Nhóm B", backgroundTotal: 22, feasibilityTotal: 5, youthRoleTotal: 5, presentationDurationSeconds: 305 }),
    ], 300);
    expect(result.winnerIds).toEqual(["b"]);
    expect(result.decidedBy).toBe("timeCompliance");
  });

  it("giải Tiếng nói Thanh niên dùng điểm nền rồi hỏi đáp", () => {
    const result = rankYouthVoiceAward([
      group({ id: "a", presentationTotal: 18, backgroundTotal: 22, qaTotal: 4 }),
      group({ id: "b", name: "Nhóm B", presentationTotal: 18, backgroundTotal: 22, qaTotal: 5 }),
    ]);
    expect(result.winnerIds).toEqual(["b"]);
    expect(result.decidedBy).toBe("averageQa");
  });

  it("không tự chọn khi mọi tie-break vẫn hòa", () => {
    const result = rankComprehensiveAward([
      group({ id: "a" }),
      group({ id: "b", name: "Nhóm B" }),
    ], 300);
    expect(result.status).toBe("manual_decision_required");
    expect(result.winnerIds).toEqual(["a", "b"]);
  });

  it("không dùng thời gian nếu chưa cấu hình thời lượng chuẩn", () => {
    const result = rankYouthVoiceAward([
      group({ id: "a", presentationDurationSeconds: 250 }),
      group({ id: "b", name: "Nhóm B", presentationDurationSeconds: 300 }),
    ]);
    expect(result.status).toBe("manual_decision_required");
  });

  it("coi các nhóm không vượt thời lượng là tuân thủ ngang nhau", () => {
    const result = rankComprehensiveAward([
      group({ id: "a", presentationDurationSeconds: 250 }),
      group({ id: "b", name: "Nhóm B", presentationDurationSeconds: 300 }),
    ], 300);
    expect(result.status).toBe("manual_decision_required");
  });
});
