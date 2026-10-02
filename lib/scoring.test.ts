import { describe, expect, it } from "vitest";
import {
  aggregateScores,
  allocateAwards,
  calculateImpressionScore,
  calculateMediaScore,
  calculateScoreTotals,
  rankComprehensiveAward,
  rankGalleryWalkAward,
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
  directVotingScore: 0,
  mediaScore: 0,
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

describe("xếp từng giải", () => {
  it("giải Sáng kiến Ấn tượng dùng voting rồi điểm nền để phá hòa", () => {
    const result = rankGalleryWalkAward([
      group({ id: "a", directVotingScore: 120, backgroundTotal: 20 }),
      group({ id: "b", name: "Nhóm B", directVotingScore: 120, backgroundTotal: 22 }),
    ]);
    expect(result.winnerIds).toEqual(["b"]);
    expect(result.decidedBy).toBe("averageBackground");
  });

  it("giải Ấn tượng không phá hòa bằng điểm nền chưa hoàn chỉnh", () => {
    const result = rankGalleryWalkAward([
      group({ id: "a", directVotingScore: 120, scoreCount: 0, backgroundTotal: 0 }),
      group({ id: "b", name: "Nhóm B", directVotingScore: 120, backgroundTotal: 22 }),
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

const fiveGroups = () => [
  group({ id: "a", name: "Nhóm A", backgroundTotal: 25, presentationTotal: 20, directVotingScore: 999, mediaScore: 999 }),
  group({ id: "b", name: "Nhóm B", backgroundTotal: 24, presentationTotal: 20, directVotingScore: 888, mediaScore: 888 }),
  group({ id: "c", name: "Nhóm C", backgroundTotal: 23, presentationTotal: 18, directVotingScore: 100, mediaScore: 100 }),
  group({ id: "d", name: "Nhóm D", backgroundTotal: 22, presentationTotal: 17, directVotingScore: 90, mediaScore: 200 }),
  group({ id: "e", name: "Nhóm E", backgroundTotal: 21, presentationTotal: 16, directVotingScore: 95, mediaScore: 150 }),
];

describe("phân bổ tuần tự 5 giải", () => {
  it("loại mỗi nhóm thắng khỏi các giải tiếp theo", () => {
    const allocation = allocateAwards(fiveGroups(), 300);
    const winners = [
      allocation.comprehensive,
      allocation.youthVoice,
      allocation.galleryWalk,
      allocation.mediaVoice,
      allocation.potential,
    ].flatMap((award) => award.winnerIds);
    expect(winners).toEqual(["a", "b", "c", "d", "e"]);
    expect(new Set(winners).size).toBe(5);
  });

  it("trao Toàn diện theo điểm nền cao nhất", () => {
    expect(allocateAwards(fiveGroups(), 300).comprehensive.winnerIds).toEqual(["a"]);
  });

  it("trao Tiếng nói Thanh niên theo điểm hình thức trong các nhóm còn lại", () => {
    expect(allocateAwards(fiveGroups(), 300).youthVoice.winnerIds).toEqual(["b"]);
  });

  it("trao Sáng kiến Ấn tượng theo voting, không theo media", () => {
    const allocation = allocateAwards(fiveGroups(), 300);
    expect(allocation.galleryWalk.winnerIds).toEqual(["c"]);
    expect(allocation.galleryWalk.decidedBy).toBe("directVotingScore");
  });

  it("trao Tiếng nói Ấn tượng theo media của hai nhóm cuối", () => {
    expect(allocateAwards(fiveGroups(), 300).mediaVoice.winnerIds).toEqual(["d"]);
  });

  it("trao Sáng kiến Tiềm năng cho nhóm cuối còn lại", () => {
    expect(allocateAwards(fiveGroups(), 300).potential.winnerIds).toEqual(["e"]);
  });

  it("để cả hai giải cuối chờ quyết định khi media bằng nhau", () => {
    const groups = fiveGroups();
    groups[4] = { ...groups[4], mediaScore: 200 };
    const allocation = allocateAwards(groups, 300);
    expect(allocation.mediaVoice.status).toBe("manual_decision_required");
    expect(allocation.potential.status).toBe("manual_decision_required");
    expect(allocation.mediaVoice.winnerIds).toEqual(["d", "e"]);
    expect(allocation.potential.winnerIds).toEqual(["d", "e"]);
  });

  it("dừng các giải sau khi giải trước cần quyết định thủ công", () => {
    const groups = fiveGroups();
    groups[1] = {
      ...groups[1],
      backgroundTotal: groups[0].backgroundTotal,
      feasibilityTotal: groups[0].feasibilityTotal,
      youthRoleTotal: groups[0].youthRoleTotal,
      presentationDurationSeconds: groups[0].presentationDurationSeconds,
    };
    const allocation = allocateAwards(groups, 300);
    expect(allocation.comprehensive.status).toBe("manual_decision_required");
    expect(allocation.youthVoice.status).toBe("no_data");
    expect(allocation.galleryWalk.status).toBe("no_data");
    expect(allocation.mediaVoice.status).toBe("no_data");
    expect(allocation.potential.status).toBe("no_data");
  });
});
