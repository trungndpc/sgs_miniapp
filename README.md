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

- `APP_ID=785201541181634790`
- `VITE_IDENTITY_API_BASE_URL=http://localhost:8080`
- `VITE_CONTENT_API_BASE_URL=http://localhost:8082`
- `VITE_TENANT_CODE=sgs`
- `VITE_ZALO_AUTH_DEV_MODE=true`

## Deploy lên Zalo

```bash
# .env.production đã trỏ production API; cần APP_ID trong .env
npm run zmp:login    # quét QR bằng Zalo
npm run zmp:deploy   # Development (ghi đè mỗi lần)
# hoặc
npm run zmp:deploy:testing   # Testing (lưu phiên bản, gửi duyệt)
```

Auth: trên Zalo dùng `getAccessToken` → `POST /auth/zalo` → lưu Galaxy `access_token` (JWT). API calls dùng `Authorization: Bearer <access_token>`; hết hạn thì login lại bằng Zalo (không refresh token).

Mở Mini App bằng QR sau khi deploy, hoặc deep link:
`https://zalo.me/app/link/zapps/785201541181634790`

Xem thêm: [`../docs/sgs-miniapp-design.md`](../docs/sgs-miniapp-design.md).
