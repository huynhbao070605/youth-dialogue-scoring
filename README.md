# Youth-led Dialogue Scoring

Ứng dụng nội bộ để nhập phiếu BGK, tổng hợp điểm truyền thông/voting và xác định kết quả giải thưởng.

## Chạy local

```bash
npm install
npm run db:push
npm run dev
```

Mở `http://localhost:3000`.

Dữ liệu SQLite mặc định nằm tại `prisma/dev.db`. Để chạy bản production local:

```bash
npm run build
npm start
```

Sao lưu hoặc khôi phục bằng cách dừng ứng dụng rồi sao chép file `prisma/dev.db`.

## Kiểm tra

```bash
npm test
npm run typecheck
npm run lint
npm run build
```
