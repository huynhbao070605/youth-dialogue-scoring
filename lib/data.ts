import { prisma } from "./db";
import {
  aggregateScores,
  calculateImpressionScore,
  calculateMediaScore,
  type GroupResult,
  type ScoreValues,
} from "./scoring";

export async function getDashboardData() {
  const [groups, judges] = await Promise.all([
    prisma.group.findMany({ include: { scores: true }, orderBy: { createdAt: "asc" } }),
    prisma.judge.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return {
    judges,
    totalJudges: judges.length,
    groups: groups.map((group) => {
      const scorecards = group.scores.map((score) => ({
        coreProblem: score.coreProblem,
        problemTreeLogic: score.problemTreeLogic,
        localEvidence: score.localEvidence,
        feasibility: score.feasibility,
        youthRole: score.youthRole,
        solutionStructure: score.solutionStructure,
        visualLayout: score.visualLayout,
        presentation: score.presentation,
        qa: score.qa,
      } satisfies ScoreValues));
      const aggregate = aggregateScores(scorecards);
      const mediaScore = calculateMediaScore(group.likes, group.comments, group.shares);
      return {
        ...group,
        aggregate,
        mediaScore,
        impressionScore: calculateImpressionScore(
          group.likes,
          group.comments,
          group.shares,
          group.directVotingScore,
        ),
        isComplete: judges.length > 0 && aggregate.scoreCount === judges.length,
      };
    }),
  };
}

export function toGroupResult(group: Awaited<ReturnType<typeof getDashboardData>>["groups"][number]): GroupResult {
  return {
    id: group.id,
    name: group.name,
    scoreCount: group.aggregate.scoreCount,
    backgroundTotal: group.aggregate.backgroundTotal,
    presentationTotal: group.aggregate.presentationTotal,
    feasibilityTotal: group.aggregate.feasibilityTotal,
    youthRoleTotal: group.aggregate.youthRoleTotal,
    qaTotal: group.aggregate.qaTotal,
    directVotingScore: group.directVotingScore,
    mediaScore: group.mediaScore,
    presentationDurationSeconds: group.presentationDurationSeconds,
  };
}
