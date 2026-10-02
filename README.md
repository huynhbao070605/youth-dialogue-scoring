# Youth-led Dialogue Scoring

Ứng dụng nội bộ để nhập phiếu BGK, tổng hợp điểm truyền thông/voting và xác định kết quả giải thưởng.

## Chạy local

Tạo `.env` từ `.env.example`, đặt `DATABASE_URL` là chuỗi kết nối có pooling và `DIRECT_URL` là chuỗi kết nối trực tiếp tới cùng PostgreSQL database, rồi chạy:

```bash
npm install
npm run db:migrate
npm run dev
```

Mở `http://localhost:3000`.

## Triển khai Vercel

- Thêm `DATABASE_URL` (pooled) và `DIRECT_URL` (direct/non-pooling) trong Vercel Project Settings → Environment Variables.
- Đặt Build Command thành `npm run db:deploy && npm run build`.
- Deploy lại dự án. Migration production được áp dụng bằng `prisma migrate deploy`.

## Kiểm tra

```bash
npm test
npm run typecheck
npm run lint
npm run build
```
