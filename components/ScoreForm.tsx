"use client";

import { useState } from "react";
import { deleteScore, saveScore } from "@/app/actions";
import { ConfirmButton } from "./ConfirmButton";
import { SCORE_FIELDS, type ScoreField, type ScoreValues } from "@/lib/scoring";

const labels: Record<ScoreField, string> = {
  coreProblem: "Xác định vấn đề cốt lõi",
  problemTreeLogic: "Nguyên nhân – hệ quả & logic Cây vấn đề",
  localEvidence: "Bằng chứng & tiếng nói địa phương",
  feasibility: "Khả năng thực thi của giải pháp",
  youthRole: "Vai trò thanh thiếu niên",
  solutionStructure: "Vấn đề – nguyên nhân – tác động – giải pháp",
  visualLayout: "Bố cục trực quan, mạch lạc",
  presentation: "Thuyết trình rõ ràng, thuyết phục",
  qa: "Trả lời câu hỏi và bảo vệ quan điểm",
};

export function ScoreForm({ groupId, judgeId, initial }: { groupId: string; judgeId: string; initial: ScoreValues | null }) {
  const [values, setValues] = useState<Partial<ScoreValues>>(initial ?? {});
  const background = SCORE_FIELDS.slice(0, 5).reduce((sum, field) => sum + (values[field] ?? 0), 0);
  const presentation = SCORE_FIELDS.slice(5).reduce((sum, field) => sum + (values[field] ?? 0), 0);

  return (
    <div>
      <form action={saveScore} className="score-form">
        <input type="hidden" name="groupId" value={groupId} />
        <input type="hidden" name="judgeId" value={judgeId} />
        <section className="card">
          <div className="section-heading"><div><span className="eyebrow">Phần 1</span><h2>Tiêu chí nền / Nội dung</h2></div><strong className="score-total">{background} / 25</strong></div>
          {SCORE_FIELDS.slice(0, 5).map((field, index) => <ScoreInput key={field} field={field} index={index + 1} value={values[field]} onChange={(value) => setValues((current) => ({ ...current, [field]: value }))} />)}
        </section>
        <section className="card">
          <div className="section-heading"><div><span className="eyebrow">Phần 2</span><h2>Tiêu chí hình thức</h2></div><strong className="score-total">{presentation} / 20</strong></div>
          {SCORE_FIELDS.slice(5).map((field, index) => <ScoreInput key={field} field={field} index={index + 6} value={values[field]} onChange={(value) => setValues((current) => ({ ...current, [field]: value }))} />)}
        </section>
        <button className="button primary" type="submit">Lưu phiếu điểm</button>
      </form>
      {initial && <form action={deleteScore} className="delete-score"><input type="hidden" name="groupId" value={groupId} /><input type="hidden" name="judgeId" value={judgeId} /><ConfirmButton>Xóa phiếu</ConfirmButton></form>}
    </div>
  );
}

function ScoreInput({ field, index, value, onChange }: { field: ScoreField; index: number; value?: number; onChange: (value: number) => void }) {
  return (
    <label className="score-row">
      <span className="criterion-number">{index}</span>
      <span>{labels[field]}</span>
      <input name={field} type="number" min="1" max="5" step="1" required value={value ?? ""} onChange={(event) => onChange(Number(event.target.value))} />
      <small>/ 5</small>
    </label>
  );
}
