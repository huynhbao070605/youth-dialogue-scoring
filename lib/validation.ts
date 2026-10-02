export function parseCriterionScore(value: FormDataEntryValue | null): number {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 5) {
    throw new Error("Điểm tiêu chí phải là số nguyên từ 1 đến 5.");
  }
  return number;
}

export function parseNonNegativeInteger(
  value: FormDataEntryValue | null,
  label: string,
): number {
  const number = Number(value);
  if (value === null || value === "" || !Number.isInteger(number) || number < 0 || number > 2_147_483_647) {
    throw new Error(`${label} phải là số nguyên không âm.`);
  }
  return number;
}

export function parseOptionalDuration(
  minutesValue: FormDataEntryValue | null,
  secondsValue: FormDataEntryValue | null,
): number | null {
  if ((minutesValue === null || minutesValue === "") && (secondsValue === null || secondsValue === "")) {
    return null;
  }
  const minutes = parseNonNegativeInteger(minutesValue || "0", "Phút");
  const seconds = parseNonNegativeInteger(secondsValue || "0", "Giây");
  if (seconds > 59) throw new Error("Số giây phải từ 0 đến 59.");
  const duration = minutes * 60 + seconds;
  if (duration > 2_147_483_647) throw new Error("Thời gian nhập vào quá lớn.");
  return duration;
}

export function requiredText(value: FormDataEntryValue | null, label: string): string {
  const text = String(value ?? "").trim();
  if (!text) throw new Error(`${label} không được để trống.`);
  return text;
}
