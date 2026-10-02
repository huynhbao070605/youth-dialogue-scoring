"use client";

import { useState } from "react";
import { updatePotentialAwards } from "@/app/actions";

export function PotentialForm({ groups }: { groups: Array<{ id: string; name: string; initiative: string; selected: boolean }> }) {
  const [selected, setSelected] = useState(groups.filter((group) => group.selected).map((group) => group.id));
  return (
    <form action={updatePotentialAwards} className="potential-form">
      {groups.map((group) => {
        const checked = selected.includes(group.id);
        return <label key={group.id} className={`potential-option ${checked ? "selected" : ""}`}><input type="checkbox" name="groupIds" value={group.id} checked={checked} disabled={!checked && selected.length >= 2} onChange={() => setSelected((current) => checked ? current.filter((id) => id !== group.id) : [...current, group.id])} /><span><strong>{group.name}</strong><small>{group.initiative}</small></span></label>;
      })}
      <div className="form-footer"><span>Đã chọn {selected.length}/2 nhóm</span><button className="button primary" type="submit">Lưu lựa chọn</button></div>
    </form>
  );
}
