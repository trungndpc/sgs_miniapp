# sgs_miniapp

Zalo Mini App **SGS Academy** (fork từ ZaUI Uni, restyle SGS).

## Chức năng MVP

- Đăng nhập Zalo → `identity_core` upsert
- Đăng ký thành viên (auto-active)
- Tin tức (public / member-only)
- Lịch đào tạo (theo ngày / theo khóa) + đăng ký lớp
- Hồ sơ + danh sách lớp đã đăng ký

## Dev

```bash
cp -n .env.example .env
npm install
npm run dev
```

Env:

- `VITE_IDENTITY_API_BASE_URL=http://localhost:8080`
- `VITE_CONTENT_API_BASE_URL=http://localhost:8082`
- `VITE_TENANT_CODE=sgs`
- `VITE_ZALO_AUTH_DEV_MODE=true`

Xem thêm: [`../docs/sgs-miniapp-design.md`](../docs/sgs-miniapp-design.md).
