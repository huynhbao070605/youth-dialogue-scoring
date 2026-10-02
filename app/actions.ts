"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { SCORE_FIELDS, type ScoreField } from "@/lib/scoring";
import {
  parseCriterionScore,
  parseNonNegativeInteger,
  parseOptionalDuration,
  requiredText,
} from "@/lib/validation";

const refreshAll = () => {
  revalidatePath("/");
  revalidatePath("/scores");
  revalidatePath("/media");
  revalidatePath("/results");
};

export async function createGroup(formData: FormData) {
  await prisma.group.create({
    data: {
      name: requiredText(formData.get("name"), "Tên nhóm"),
      initiative: requiredText(formData.get("initiative"), "Tên sáng kiến"),
      notes: String(formData.get("notes") ?? "").trim(),
    },
  });
  refreshAll();
}

export async function updateGroup(formData: FormData) {
  const id = requiredText(formData.get("id"), "Nhóm");
  await prisma.group.update({
    where: { id },
    data: {
      name: requiredText(formData.get("name"), "Tên nhóm"),
      initiative: requiredText(formData.get("initiative"), "Tên sáng kiến"),
      notes: String(formData.get("notes") ?? "").trim(),
    },
  });
  refreshAll();
}

export async function deleteGroup(formData: FormData) {
  await prisma.group.delete({ where: { id: requiredText(formData.get("id"), "Nhóm") } });
  refreshAll();
  redirect("/");
}

export async function createJudge(formData: FormData) {
  await prisma.judge.create({ data: { name: requiredText(formData.get("name"), "Tên BGK") } });
  refreshAll();
}

export async function updateJudge(formData: FormData) {
  await prisma.judge.update({
    where: { id: requiredText(formData.get("id"), "BGK") },
    data: { name: requiredText(formData.get("name"), "Tên BGK") },
  });
  refreshAll();
}

export async function deleteJudge(formData: FormData) {
  await prisma.judge.delete({ where: { id: requiredText(formData.get("id"), "BGK") } });
  refreshAll();
}

export async function saveScore(formData: FormData) {
  const groupId = requiredText(formData.get("groupId"), "Nhóm");
  const judgeId = requiredText(formData.get("judgeId"), "BGK");
  const values = Object.fromEntries(
    SCORE_FIELDS.map((field) => [field, parseCriterionScore(formData.get(field))]),
  ) as Record<ScoreField, number>;
  await prisma.score.upsert({
    where: { groupId_judgeId: { groupId, judgeId } },
    create: { groupId, judgeId, ...values },
    update: values,
  });
  refreshAll();
  revalidatePath(`/groups/${groupId}`);
  redirect(`/scores?groupId=${groupId}&judgeId=${judgeId}&saved=1`);
}

export async function deleteScore(formData: FormData) {
  const groupId = requiredText(formData.get("groupId"), "Nhóm");
  const judgeId = requiredText(formData.get("judgeId"), "BGK");
  await prisma.score.delete({ where: { groupId_judgeId: { groupId, judgeId } } });
  refreshAll();
  revalidatePath(`/groups/${groupId}`);
  redirect(`/scores?groupId=${groupId}&judgeId=${judgeId}`);
}

export async function updateMedia(formData: FormData) {
  const id = requiredText(formData.get("id"), "Nhóm");
  await prisma.group.update({
    where: { id },
    data: {
      likes: parseNonNegativeInteger(formData.get("likes"), "Like"),
      comments: parseNonNegativeInteger(formData.get("comments"), "Comment"),
      shares: parseNonNegativeInteger(formData.get("shares"), "Share"),
      directVotingScore: parseNonNegativeInteger(formData.get("directVotingScore"), "Voting"),
      presentationDurationSeconds: parseOptionalDuration(
        formData.get("presentationMinutes"),
        formData.get("presentationSeconds"),
      ),
    },
  });
  refreshAll();
}

export async function updateTargetTime(formData: FormData) {
  const target = parseOptionalDuration(formData.get("targetMinutes"), formData.get("targetSeconds"));
  await prisma.setting.upsert({
    where: { id: 1 },
    create: { id: 1, targetPresentationSeconds: target },
    update: { targetPresentationSeconds: target },
  });
  revalidatePath("/media");
  revalidatePath("/results");
}
