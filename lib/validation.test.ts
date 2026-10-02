import { describe, expect, it } from "vitest";
import { parseCriterionScore, parseNonNegativeInteger, parseOptionalDuration } from "./validation";

describe("kiểm tra dữ liệu nhập", () => {
  it("chỉ nhận điểm tiêu chí nguyên từ 1 đến 5", () => {
    expect(parseCriterionScore("1")).toBe(1);
    expect(parseCriterionScore("5")).toBe(5);
    expect(() => parseCriterionScore("0")).toThrow("từ 1 đến 5");
    expect(() => parseCriterionScore("2.5")).toThrow("từ 1 đến 5");
  });

  it("chỉ nhận số đếm nguyên không âm", () => {
    expect(parseNonNegativeInteger("0", "Like")).toBe(0);
    expect(() => parseNonNegativeInteger("-1", "Like")).toThrow("không âm");
    expect(() => parseNonNegativeInteger("1.2", "Like")).toThrow("không âm");
    expect(() => parseNonNegativeInteger("2147483648", "Like")).toThrow("không âm");
  });

  it("đổi phút và giây thành tổng giây hoặc để trống", () => {
    expect(parseOptionalDuration("5", "12")).toBe(312);
    expect(parseOptionalDuration("", "")).toBeNull();
    expect(() => parseOptionalDuration("1", "60")).toThrow("0 đến 59");
    expect(() => parseOptionalDuration("999999999", "0")).toThrow("quá lớn");
  });
});
