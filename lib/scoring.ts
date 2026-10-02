export const SCORE_FIELDS = [
  "coreProblem",
  "problemTreeLogic",
  "localEvidence",
  "feasibility",
  "youthRole",
  "solutionStructure",
  "visualLayout",
  "presentation",
  "qa",
] as const;

export type ScoreField = (typeof SCORE_FIELDS)[number];

export type ScoreValues = Record<ScoreField, number>;

export interface ScoreAggregate {
  scoreCount: number;
  backgroundTotal: number;
  presentationTotal: number;
  feasibilityTotal: number;
  youthRoleTotal: number;
  qaTotal: number;
  averageBackground: number | null;
  averagePresentation: number | null;
  averageFeasibility: number | null;
  averageYouthRole: number | null;
  averageQa: number | null;
  criterionAverages: Record<ScoreField, number | null>;
}

export interface GroupResult {
  id: string;
  name: string;
  scoreCount: number;
  backgroundTotal: number;
  presentationTotal: number;
  feasibilityTotal: number;
  youthRoleTotal: number;
  qaTotal: number;
  impressionScore: number;
  presentationDurationSeconds: number | null;
}

export type TieBreaker =
  | "impressionScore"
  | "averageBackground"
  | "averagePresentation"
  | "averageFeasibility"
  | "averageYouthRole"
  | "averageQa"
  | "timeCompliance";

export interface AwardResult {
  status: "winner" | "manual_decision_required" | "no_data";
  winnerIds: string[];
  decidedBy: TieBreaker | null;
}

export function calculateScoreTotals(scores: ScoreValues) {
  return {
    background:
      scores.coreProblem +
      scores.problemTreeLogic +
      scores.localEvidence +
      scores.feasibility +
      scores.youthRole,
    presentation:
      scores.solutionStructure +
      scores.visualLayout +
      scores.presentation +
      scores.qa,
  };
}

export function calculateMediaScore(likes: number, comments: number, shares: number) {
  return likes + comments + shares * 3;
}

export function calculateImpressionScore(
  likes: number,
  comments: number,
  shares: number,
  directVotingScore: number,
) {
  return calculateMediaScore(likes, comments, shares) + directVotingScore;
}

export function aggregateScores(scorecards: ScoreValues[]): ScoreAggregate {
  const sums = Object.fromEntries(SCORE_FIELDS.map((field) => [field, 0])) as Record<ScoreField, number>;
  let backgroundTotal = 0;
  let presentationTotal = 0;

  for (const scorecard of scorecards) {
    for (const field of SCORE_FIELDS) sums[field] += scorecard[field];
    const totals = calculateScoreTotals(scorecard);
    backgroundTotal += totals.background;
    presentationTotal += totals.presentation;
  }

  const scoreCount = scorecards.length;
  const average = (total: number) => (scoreCount ? total / scoreCount : null);

  return {
    scoreCount,
    backgroundTotal,
    presentationTotal,
    feasibilityTotal: sums.feasibility,
    youthRoleTotal: sums.youthRole,
    qaTotal: sums.qa,
    averageBackground: average(backgroundTotal),
    averagePresentation: average(presentationTotal),
    averageFeasibility: average(sums.feasibility),
    averageYouthRole: average(sums.youthRole),
    averageQa: average(sums.qa),
    criterionAverages: Object.fromEntries(
      SCORE_FIELDS.map((field) => [field, average(sums[field])]),
    ) as Record<ScoreField, number | null>,
  };
}

type Comparator = (left: GroupResult, right: GroupResult) => number | null;

const compareNumber = (pick: (group: GroupResult) => number): Comparator =>
  (left, right) => Math.sign(pick(left) - pick(right));

const compareAverage = (pick: (group: GroupResult) => number): Comparator =>
  (left, right) => {
    if (!left.scoreCount || !right.scoreCount) return null;
    return Math.sign(pick(left) * right.scoreCount - pick(right) * left.scoreCount);
  };

function resolveAward(
  groups: GroupResult[],
  rules: Array<{ name: TieBreaker; compare: Comparator }>,
): AwardResult {
  if (!groups.length) return { status: "no_data", winnerIds: [], decidedBy: null };
  let contenders = [...groups];
  let decidedBy: TieBreaker | null = null;

  for (const rule of rules) {
    if (contenders.length <= 1) break;
    let best = contenders[0];
    let comparable = true;
    for (const contender of contenders.slice(1)) {
      const comparison = rule.compare(contender, best);
      if (comparison === null) {
        comparable = false;
        break;
      }
      if (comparison > 0) best = contender;
    }
    if (!comparable) continue;

    const next = contenders.filter((contender) => rule.compare(contender, best) === 0);
    if (next.length < contenders.length) decidedBy = rule.name;
    contenders = next;
  }

  return {
    status: contenders.length === 1 ? "winner" : "manual_decision_required",
    winnerIds: contenders.map((group) => group.id),
    decidedBy,
  };
}

const averageBackground = compareAverage((group) => group.backgroundTotal);
const averagePresentation = compareAverage((group) => group.presentationTotal);
const averageFeasibility = compareAverage((group) => group.feasibilityTotal);
const averageYouthRole = compareAverage((group) => group.youthRoleTotal);
const averageQa = compareAverage((group) => group.qaTotal);

function timeCompliance(targetSeconds?: number | null): Comparator {
  return (left, right) => {
    if (
      targetSeconds == null ||
      left.presentationDurationSeconds == null ||
      right.presentationDurationSeconds == null
    ) return null;
    const leftDeviation = Math.max(0, left.presentationDurationSeconds - targetSeconds);
    const rightDeviation = Math.max(0, right.presentationDurationSeconds - targetSeconds);
    return Math.sign(rightDeviation - leftDeviation);
  };
}

export function rankImpressionAward(groups: GroupResult[]): AwardResult {
  return resolveAward(groups, [
    { name: "impressionScore", compare: compareNumber((group) => group.impressionScore) },
    { name: "averageBackground", compare: averageBackground },
  ]);
}

export function rankComprehensiveAward(groups: GroupResult[], targetSeconds?: number | null): AwardResult {
  return resolveAward(groups, [
    { name: "averageBackground", compare: averageBackground },
    { name: "averageFeasibility", compare: averageFeasibility },
    { name: "averageYouthRole", compare: averageYouthRole },
    { name: "timeCompliance", compare: timeCompliance(targetSeconds) },
  ]);
}

export function rankYouthVoiceAward(groups: GroupResult[], targetSeconds?: number | null): AwardResult {
  return resolveAward(groups, [
    { name: "averagePresentation", compare: averagePresentation },
    { name: "averageBackground", compare: averageBackground },
    { name: "averageQa", compare: averageQa },
    { name: "timeCompliance", compare: timeCompliance(targetSeconds) },
  ]);
}
