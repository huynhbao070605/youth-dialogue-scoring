"use client";

import { useState } from "react";
import { updateMedia } from "@/app/actions";

type Values = { likes: number; comments: number; shares: number; directVotingScore: number; presentationDurationSeconds: number | null };

export function MediaRow({ id, name, initial }: { id: string; name: string; initial: Values }) {
  const formId = `media-${id}`;
  const [values, setValues] = useState(initial);
  const media = values.likes + values.comments + values.shares * 3;
  const minutes = initial.presentationDurationSeconds == null ? "" : Math.floor(initial.presentationDurationSeconds / 60);
  const seconds = initial.presentationDurationSeconds == null ? "" : initial.presentationDurationSeconds % 60;
  const numberField = (field: keyof Pick<Values, "likes" | "comments" | "shares" | "directVotingScore">) => (
    <input form={formId} name={field} aria-label={`${name} ${field}`} type="number" min="0" max="2147483647" step="1" required value={values[field]} onChange={(event) => setValues((current) => ({ ...current, [field]: Number(event.target.value) }))} />
  );
  return (
    <tr>
      <td><strong>{name}</strong></td>
      <td>{numberField("likes")}</td><td>{numberField("comments")}</td><td>{numberField("shares")}</td>
      <td className="calculated">{media}</td>
      <td>{numberField("directVotingScore")}</td>
      <td className="calculated accent-number">{media + values.directVotingScore}</td>
      <td><div className="duration"><input form={formId} name="presentationMinutes" aria-label={`${name} phút`} type="number" min="0" step="1" defaultValue={minutes} placeholder="phút" /><span>:</span><input form={formId} name="presentationSeconds" aria-label={`${name} giây`} type="number" min="0" max="59" step="1" defaultValue={seconds} placeholder="giây" /></div></td>
      <td><form id={formId} action={updateMedia}><input type="hidden" name="id" value={id} /><button className="button secondary">Lưu</button></form></td>
    </tr>
  );
}
