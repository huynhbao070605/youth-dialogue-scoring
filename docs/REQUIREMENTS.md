# Youth-led Dialogue Scoring System — Requirements

## 1. Mục tiêu

Xây dựng một website nội bộ đơn giản để hỗ trợ Ban Tổ chức Youth-led Dialogue nhập và tổng hợp kết quả đánh giá các sáng kiến.

Ban Giám khảo **không chấm trực tiếp trên website**.

Quy trình thực tế:

1. Ban Giám khảo chấm điểm trên phiếu giấy.
2. Nhân sự Ban Tổ chức nhận phiếu.
3. Nhân sự nhập điểm của từng Ban Giám khảo vào website.
4. Website tự tính tổng điểm và điểm trung bình.
5. Nhân sự nhập số liệu truyền thông và voting trực tiếp.
6. Website tự tính các chỉ số phục vụ xét giải.
7. Website hiển thị bảng tổng hợp và kết quả các hạng mục giải thưởng.

Mục tiêu ưu tiên:

1. Tính điểm chính xác.
2. Nhập liệu nhanh.
3. Giao diện đơn giản, dễ sử dụng trong sự kiện.
4. Dữ liệu được lưu lại sau khi reload/truy cập lại website.
5. Hạn chế tối đa việc tính toán thủ công bằng Excel.

---

# 2. Nguồn tham chiếu

Hai tài liệu sau là nguồn tham chiếu chính:

- `references/rubric.docx`
- `references/award-rules.docx`

Nếu nội dung trong file này mâu thuẫn với tài liệu tham chiếu, cần ưu tiên tài liệu tham chiếu và báo rõ mâu thuẫn trước khi thay đổi scoring logic.

Không tự bổ sung hoặc suy diễn thêm các luật xét giải không có trong tài liệu hoặc requirements này.

---

# 3. Phạm vi MVP

Website MVP chỉ cần các chức năng:

1. Quản lý nhóm dự thi.
2. Quản lý Ban Giám khảo.
3. Nhập điểm BGK cho từng nhóm.
4. Nhập số liệu truyền thông.
5. Nhập voting trực tiếp.
6. Nhập thời gian trình bày nếu cần phục vụ tie-break.
7. Tự động tính điểm.
8. Hiển thị bảng tổng hợp.
9. Xác định/đề xuất kết quả giải thưởng theo các rule được quy định.
10. Cho phép sửa dữ liệu đã nhập.

Không cần xây dựng:

- tài khoản riêng cho từng BGK;
- chấm điểm trực tiếp bằng điện thoại của BGK;
- OAuth;
- JWT phức tạp;
- email;
- notification;
- realtime WebSocket;
- analytics;
- biểu đồ;
- dark mode;
- animation;
- import Excel;
- export PDF;
- CI/CD;
- microservices;
- Redis;
- cloud storage;
- hệ thống permission phức tạp.

---

# 4. Đối tượng sử dụng

MVP chỉ có một loại người dùng:

**Ban Tổ chức / Nhân sự nhập liệu**

Người dùng có thể:

- tạo/sửa/xóa nhóm;
- tạo/sửa/xóa BGK;
- nhập điểm;
- nhập dữ liệu truyền thông;
- nhập voting;
- xem bảng tổng hợp;
- xem kết quả giải thưởng.

Không cần tạo account riêng cho Ban Giám khảo.

---

# 5. Nhóm dự thi

Mỗi nhóm cần tối thiểu các thông tin:

- ID
- Tên nhóm
- Tên sáng kiến hoặc vấn đề nhóm lựa chọn
- Ghi chú, nếu cần

Số lượng nhóm không hard-code.

Người dùng phải có thể:

- thêm nhóm;
- sửa nhóm;
- xóa nhóm.

Nếu nhóm đã có dữ liệu chấm điểm, cần confirmation trước khi xóa.

---

# 6. Ban Giám khảo

Mỗi BGK gồm:

- ID
- Họ tên

Số lượng BGK không hard-code.

Người dùng phải có thể:

- thêm BGK;
- sửa tên BGK;
- xóa BGK.

Nếu BGK đã có dữ liệu chấm điểm, cần confirmation trước khi xóa.

---

# 7. Điểm đánh giá của Ban Giám khảo

Mỗi cặp:

`Nhóm × BGK`

có một phiếu điểm.

Phiếu gồm hai phần:

- Tiêu chí nền / Nội dung
- Tiêu chí hình thức

---

# 8. Tiêu chí nền — Nội dung

Có 5 tiêu chí.

Mỗi tiêu chí được chấm từ **1 đến 5 điểm**.

## 8.1. Xác định vấn đề cốt lõi

Tên field:

`core_problem`

## 8.2. Nguyên nhân – hệ quả & logic của Cây vấn đề

Tên field:

`problem_tree_logic`

## 8.3. Bằng chứng & tiếng nói địa phương

Tên field:

`local_evidence`

## 8.4. Khả năng thực thi của giải pháp

Tên field:

`feasibility`

## 8.5. Vai trò thanh thiếu niên thể hiện trong giải pháp

Tên field:

`youth_role`

## Công thức

```text
background_score =
core_problem
+ problem_tree_logic
+ local_evidence
+ feasibility
+ youth_role
```

Điểm tối đa:

```text
25
```

Người dùng **không được nhập trực tiếp tổng /25**.

Website phải tự tính.

---

# 9. Tiêu chí hình thức

Có 4 tiêu chí.

Mỗi tiêu chí được chấm từ **1 đến 5 điểm**.

## 9.1. Thể hiện rõ vấn đề – nguyên nhân – tác động – giải pháp

Tên field:

`solution_structure`

## 9.2. Bố cục trực quan, mạch lạc, dễ hiểu

Tên field:

`visual_layout`

## 9.3. Phần thuyết trình rõ ràng, logic, thuyết phục

Tên field:

`presentation`

## 9.4. Khả năng trả lời câu hỏi và bảo vệ quan điểm

Tên field:

`qa`

## Công thức

```text
presentation_score =
solution_structure
+ visual_layout
+ presentation
+ qa
```

Điểm tối đa:

```text
20
```

Người dùng **không được nhập trực tiếp tổng /20**.

Website phải tự tính.

---

# 10. Validation điểm BGK

Mỗi điểm thành phần:

```text
minimum = 1
maximum = 5
```

Không cho phép:

- số nhỏ hơn 1;
- số lớn hơn 5;
- chữ;
- giá trị không hợp lệ.

Website phải hiển thị rõ tổng:

```text
Điểm nền: X / 25
Điểm hình thức: Y / 20
```

---

# 11. Tổng hợp nhiều Ban Giám khảo

Một nhóm có thể được nhiều BGK chấm.

Website phải lưu riêng điểm của từng BGK.

Ví dụ:

```text
Nhóm 1
├── BGK 1
├── BGK 2
└── BGK 3
```

Điểm cuối cùng của nhóm được tính bằng **trung bình cộng của các BGK đã chấm hợp lệ**.

## 11.1. Điểm nền trung bình

```text
average_background_score =
sum(background_score của các BGK)
/
số BGK đã chấm
```

## 11.2. Điểm hình thức trung bình

```text
average_presentation_score =
sum(presentation_score của các BGK)
/
số BGK đã chấm
```

## 11.3. Điểm trung bình từng tiêu chí

Website cũng phải tính trung bình từng tiêu chí riêng.

Ví dụ:

```text
average_feasibility
average_youth_role
average_qa
```

Các điểm này cần được giữ vì được sử dụng trong tie-break.

---

# 12. Trạng thái hoàn thành chấm điểm

Dashboard phải hiển thị số BGK đã nhập cho mỗi nhóm.

Ví dụ:

```text
Nhóm 1: 3/3 BGK
Nhóm 2: 2/3 BGK
```

Nếu chưa đủ toàn bộ BGK, hiển thị cảnh báo:

```text
Chưa đủ phiếu chấm
```

Không được làm người dùng hiểu rằng kết quả đó đã hoàn chỉnh.

---

# 13. Điểm truyền thông

Điểm truyền thông được tính từ tương tác trên bài đăng của nhóm.

Công thức:

```text
1 Like    = 1 điểm
1 Comment = 1 điểm
1 Share   = 3 điểm
```

Do đó:

```text
media_score =
likes
+ comments
+ shares * 3
```

Ví dụ:

```text
Likes    = 86
Comments = 24
Shares   = 18

Media Score
= 86 + 24 + 18 × 3
= 164
```

Website chỉ yêu cầu nhân sự nhập:

- Like
- Comment
- Share

Website tự tính `media_score`.

Các giá trị phải là số nguyên không âm.

---

# 14. Voting trực tiếp

Mỗi nhóm có:

```text
direct_voting_score
```

Nhân sự nhập trực tiếp số voting hợp lệ đã được BTC tổng hợp tại sự kiện.

Giá trị phải là số nguyên không âm.

---

# 15. Điểm Sáng kiến Ấn tượng

Công thức:

```text
impression_score =
media_score
+ direct_voting_score
```

Tương đương:

```text
impression_score =
likes
+ comments
+ shares * 3
+ direct_voting_score
```

Ví dụ:

```text
media_score = 164
direct_voting_score = 25

impression_score = 189
```

---

# 16. Thời gian trình bày

Website cần cho phép nhập thời gian thực tế của từng nhóm để phục vụ tie-break.

Có thể lưu:

```text
presentation_minutes
presentation_seconds
```

hoặc tổng số giây:

```text
presentation_duration_seconds
```

Nếu thời gian quy định được cấu hình, website có thể hiển thị:

```text
Đúng thời gian
```

hoặc:

```text
Vượt X giây
```

Mục tiêu chính là có dữ liệu để BTC sử dụng khi tie-break.

Không tự đặt mức thời gian quy định nếu requirements/tài liệu không cung cấp.

Thời gian quy định nên là một cấu hình có thể nhập.

---

# 17. Giải Sáng kiến Ấn tượng

Winner chính được xác định dựa trên:

```text
MAX(impression_score)
```

Nếu có từ hai nhóm trở lên cùng điểm cao nhất:

### Tie-break 1

Ưu tiên nhóm có:

```text
average_background_score
```

cao hơn.

### Tie-break 2

Nếu vẫn bằng nhau:

Không tự động quyết định.

Website phải hiển thị:

```text
Cần Ban Giám khảo/Ban Tổ chức quyết định
```

và liệt kê các nhóm đang hòa.

---

# 18. Giải Sáng kiến Toàn diện

Winner chính được xác định dựa trên:

```text
MAX(average_background_score)
```

Nếu bằng nhau, tie-break theo thứ tự:

### Tie-break 1

```text
average_feasibility
```

cao hơn.

### Tie-break 2

Nếu vẫn bằng:

```text
average_youth_role
```

cao hơn.

### Tie-break 3

Nếu vẫn bằng:

nhóm tuân thủ quy định về thời gian trình bày tốt hơn.

Nếu hệ thống vẫn không thể xác định winner, hiển thị trạng thái:

```text
Cần BTC/BGK quyết định
```

Không tự thêm tie-break khác.

---

# 19. Giải Tiếng nói Thanh niên

Winner chính được xác định dựa trên:

```text
MAX(average_presentation_score)
```

Nếu bằng nhau, tie-break:

### Tie-break 1

```text
average_background_score
```

cao hơn.

### Tie-break 2

Nếu vẫn bằng:

```text
average_qa
```

cao hơn.

### Tie-break 3

Nếu vẫn bằng:

nhóm tuân thủ quy định về thời gian trình bày tốt hơn.

Nếu vẫn bằng nhau:

```text
Cần BTC/BGK quyết định
```

---

# 20. Giải Sáng kiến Tiềm năng

Có:

```text
02 giải Sáng kiến Tiềm năng
```

Tài liệu mô tả giải này dành cho các sáng kiến:

- có ý tưởng nổi bật;
- có hướng tiếp cận mới;
- có điểm sáng đáng ghi nhận;
- có tiềm năng tiếp tục nghiên cứu, thử nghiệm hoặc phát triển.

Hiện không có công thức số cụ thể để tự động xác định 02 giải này.

Do đó MVP **không tự động tính winner Sáng kiến Tiềm năng**.

Website cần:

1. Hiển thị bảng điểm của tất cả nhóm.
2. Cho phép BTC chọn thủ công tối đa 02 nhóm.
3. Lưu lựa chọn.
4. Hiển thị hai nhóm này trong trang kết quả.

---

# 21. Một nhóm nhận nhiều giải

Tài liệu hiện tại chưa quy định rõ một nhóm có được nhận nhiều hạng mục giải thưởng hay không.

Do đó hệ thống:

- KHÔNG tự động loại một nhóm khỏi giải khác nếu nhóm đã thắng một giải;
- có thể hiển thị cảnh báo nếu một nhóm đang được xác định ở nhiều giải;
- để BTC quyết định cuối cùng.

Không tự suy diễn luật exclusivity.

---

# 22. Dashboard

Dashboard là màn hình chính.

Cần hiển thị bảng:

| Nhóm | BGK đã nhập | Điểm nền | Hình thức | Truyền thông | Voting | Ấn tượng |
|---|---:|---:|---:|---:|---:|---:|

Ví dụ:

```text
Nhóm 1 | 3/3 | 22.67 | 17.33 | 164 | 25 | 189
Nhóm 2 | 2/3 | --    | --    | 214 | 32 | 246
```

Nếu chưa đủ phiếu BGK:

- hiển thị cảnh báo;
- không làm người dùng hiểu đây là điểm cuối cùng.

Dashboard cần có nút:

```text
+ Thêm nhóm
+ Thêm BGK
Nhập điểm BGK
Truyền thông & Voting
Xem kết quả
```

---

# 23. Màn hình nhập điểm BGK

Workflow:

1. Chọn nhóm.
2. Chọn BGK.
3. Nhập 5 điểm nội dung.
4. Nhập 4 điểm hình thức.
5. Website tự tính `/25`.
6. Website tự tính `/20`.
7. Nhấn Save.

UI cần tối ưu nhập nhanh.

Có thể sử dụng:

- number input;
- button 1–5;
- keyboard navigation.

Không cần nhập nhận xét của BGK trong MVP.

Nhận xét vẫn được lưu trên phiếu giấy.

---

# 24. Màn hình chi tiết nhóm

Khi mở một nhóm, hiển thị:

| Tiêu chí | BGK 1 | BGK 2 | BGK 3 | Trung bình |
|---|---:|---:|---:|---:|

Cần hiển thị đủ 9 tiêu chí.

Cuối bảng hiển thị:

```text
Điểm nền trung bình /25
Điểm hình thức trung bình /20
```

Mục đích:

- kiểm tra dữ liệu;
- phát hiện nhập nhầm;
- xem chênh lệch giữa BGK.

Không cần tự động đánh giá BGK nào chấm bất thường.

---

# 25. Màn hình Truyền thông & Voting

Hiển thị bảng:

| Nhóm | Like | Comment | Share | Điểm truyền thông | Voting | Điểm Ấn tượng |
|---|---:|---:|---:|---:|---:|---:|

Các cột tính toán:

```text
Điểm truyền thông
Điểm Ấn tượng
```

phải read-only.

Website tự cập nhật sau khi dữ liệu thay đổi.

---

# 26. Màn hình kết quả giải thưởng

Hiển thị:

## Sáng kiến Ấn tượng

```text
Tên nhóm
Impression Score
```

Nếu tie-break được sử dụng, phải hiển thị lý do.

Ví dụ:

```text
Nhóm A và Nhóm B cùng 220 điểm.

Nhóm A được xếp trước do điểm nền trung bình cao hơn:
Nhóm A: 22.67
Nhóm B: 21.33
```

---

## Sáng kiến Toàn diện

Hiển thị:

```text
Tên nhóm
Điểm nền trung bình
```

Nếu tie-break:

```text
Tie-break: Khả năng thực thi
```

hoặc:

```text
Tie-break: Vai trò thanh thiếu niên
```

---

## Tiếng nói Thanh niên

Hiển thị:

```text
Tên nhóm
Điểm hình thức trung bình
```

Nếu tie-break, hiển thị tiêu chí đã quyết định kết quả.

---

## Sáng kiến Tiềm năng

Cho phép BTC chọn thủ công:

```text
☐ Group A
☐ Group B
☐ Group C
...
```

Tối đa 02 nhóm.

---

# 27. Trạng thái dữ liệu

Mỗi nhóm nên có trạng thái trực quan:

```text
Chưa nhập
Đang nhập
Đủ dữ liệu
```

Có thể dùng:

```text
⚪ Chưa nhập
🟡 Chưa đủ
🟢 Hoàn thành
```

Không bắt buộc sử dụng đúng màu/icon này nếu UI framework có cách tốt hơn.

---

# 28. Lưu dữ liệu

Dữ liệu phải persistent.

Reload browser không được làm mất dữ liệu.

MVP có thể dùng:

```text
SQLite
```

với ORM phù hợp.

Không sử dụng `localStorage` làm database chính.

---

# 29. Stack ưu tiên

Ưu tiên stack đơn giản:

```text
Next.js
TypeScript
Tailwind CSS
SQLite
Prisma
```

Có thể thay đổi chi tiết nếu có lý do kỹ thuật rõ ràng, nhưng tránh bổ sung infrastructure không cần thiết.

Ứng dụng nên chạy được local bằng số bước tối thiểu.

---

# 30. UI

Phong cách:

- nền sáng;
- sạch;
- đơn giản;
- dễ đọc;
- ưu tiên desktop/laptop;
- usable trên tablet;
- không cần thiết kế mobile phức tạp.

Không cần:

- animation phức tạp;
- hiệu ứng trang trí;
- dark mode.

Các số quan trọng cần dễ nhìn.

---

# 31. Precision và rounding

Điểm trung bình BGK có thể có số thập phân.

Trong UI:

```text
hiển thị tối đa 2 chữ số thập phân
```

Ví dụ:

```text
22.666666 → 22.67
```

Tuy nhiên scoring engine nên giữ giá trị chính xác đầy đủ khi so sánh.

Không dùng giá trị đã round để xác định winner nếu có thể tránh.

---

# 32. Tie handling

Không sử dụng so sánh floating-point thiếu ổn định.

Khi xác định bằng điểm, scoring engine cần xử lý consistent.

Không được tự sinh random winner.

Nếu đã dùng hết tie-break được quy định mà vẫn hòa:

```text
status = manual_decision_required
```

---

# 33. Edit dữ liệu

Người dùng phải có thể sửa:

- điểm BGK;
- Like;
- Comment;
- Share;
- Voting;
- thời gian trình bày.

Sau khi sửa:

- tổng điểm phải cập nhật;
- ranking/kết quả phải cập nhật.

Không cần version history trong MVP.

---

# 34. Xóa dữ liệu

Trước khi xóa:

- nhóm;
- BGK;
- phiếu điểm;

phải có confirmation.

Ví dụ:

```text
Bạn có chắc muốn xóa dữ liệu này?
```

Không cần soft delete trong MVP.

---

# 35. Lock điểm

Nếu triển khai nhanh được, có thể thêm trạng thái:

```text
Draft
Locked
```

Sau khi `Locked`:

- form chuyển sang read-only.

Người dùng có thể:

```text
Unlock
```

để sửa lại.

Đây là tính năng ưu tiên thấp hơn scoring correctness.

Nếu ảnh hưởng thời gian triển khai thì có thể để sau MVP.

---

# 36. Dữ liệu mẫu để test

Giả sử:

```text
Group 1
```

BGK 1:

```text
core_problem       = 5
problem_tree_logic = 4
local_evidence     = 4
feasibility        = 5
youth_role         = 4

solution_structure = 4
visual_layout      = 5
presentation       = 4
qa                 = 5
```

Kết quả:

```text
background_score = 22
presentation_score = 18
```

Media:

```text
likes = 86
comments = 24
shares = 18
```

Expected:

```text
media_score
= 86 + 24 + 18 × 3
= 164
```

Voting:

```text
direct_voting_score = 25
```

Expected:

```text
impression_score
= 164 + 25
= 189
```

---

# 37. Acceptance Criteria

Ứng dụng chỉ được xem là hoàn thành MVP khi đáp ứng tối thiểu:

- [ ] Có thể tạo nhóm.
- [ ] Có thể tạo BGK.
- [ ] Có thể nhập 5 điểm nội dung cho một phiếu.
- [ ] Có thể nhập 4 điểm hình thức.
- [ ] Điểm chỉ hợp lệ từ 1 đến 5.
- [ ] Tổng `/25` được tính tự động.
- [ ] Tổng `/20` được tính tự động.
- [ ] Không nhập trực tiếp tổng điểm.
- [ ] Lưu riêng điểm từng BGK.
- [ ] Tính được trung bình nhiều BGK.
- [ ] Hiển thị số phiếu BGK đã nhập.
- [ ] Cảnh báo nếu nhóm chưa đủ phiếu.
- [ ] Nhập được Like.
- [ ] Nhập được Comment.
- [ ] Nhập được Share.
- [ ] Share được nhân 3.
- [ ] Tính đúng Media Score.
- [ ] Nhập được voting trực tiếp.
- [ ] Tính đúng Impression Score.
- [ ] Tính được Giải Sáng kiến Ấn tượng.
- [ ] Tie-break Sáng kiến Ấn tượng đúng rule.
- [ ] Tính được Giải Sáng kiến Toàn diện.
- [ ] Tie-break Toàn diện đúng thứ tự.
- [ ] Tính được Giải Tiếng nói Thanh niên.
- [ ] Tie-break Tiếng nói Thanh niên đúng thứ tự.
- [ ] Có thể chọn thủ công 02 Sáng kiến Tiềm năng.
- [ ] Nếu hết tie-break vẫn hòa, không tự chọn winner.
- [ ] Có bảng tổng hợp tất cả nhóm.
- [ ] Có trang chi tiết từng nhóm/từng BGK.
- [ ] Dữ liệu không mất sau reload.
- [ ] Sửa dữ liệu làm kết quả cập nhật đúng.
- [ ] Có confirmation trước khi xóa dữ liệu.

---

# 38. Priorities khi triển khai

Thứ tự ưu tiên:

## P0 — bắt buộc

1. Database
2. Groups
3. Judges
4. Nhập score
5. Scoring engine
6. Media + Voting
7. Dashboard
8. Awards calculation
9. Persistence

## P1 — nên có

1. Detail matrix
2. Presentation time
3. Manual potential award selection
4. Validation tốt
5. Confirmation khi xóa

## P2 — có thể bỏ nếu thiếu thời gian

1. Lock/unlock
2. UI polish
3. Advanced responsive behavior

Không thực hiện feature ngoài scope trước khi P0 hoàn chỉnh.

---

# 39. Nguyên tắc triển khai cho Codex

Khi implementation:

1. Đọc file requirements này.
2. Đọc cả hai tài liệu trong `references/`.
3. Xác định các contradiction nếu có.
4. Ưu tiên correctness của scoring engine.
5. Viết scoring logic thành functions độc lập, không nhúng trực tiếp toàn bộ business logic vào UI.
6. Viết unit tests cho scoring logic.
7. Dùng sample data phía trên để verify.
8. Sau khi scoring engine đúng mới hoàn thiện UI.
9. Không thêm feature không được yêu cầu.
10. Giữ codebase đơn giản và dễ chạy local.

---

# 40. Definition of Done

MVP được xem là hoàn thành khi BTC có thể thực hiện đầy đủ flow:

```text
Tạo nhóm
↓
Tạo BGK
↓
Nhận phiếu giấy từ BGK
↓
Nhập 9 điểm thành phần
↓
Website tự tính điểm BGK
↓
Website tự tính trung bình các BGK
↓
Nhập Like / Comment / Share
↓
Nhập Voting
↓
Website tự tính điểm truyền thông
↓
Website tự tính điểm Sáng kiến Ấn tượng
↓
Website áp dụng rule xét giải
↓
BTC xem bảng tổng hợp
↓
BTC xem kết quả giải thưởng
```

Nếu toàn bộ flow trên hoạt động chính xác và dữ liệu được lưu bền vững, MVP đạt yêu cầu.