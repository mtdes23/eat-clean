# Eat Clean - Full Stack App

Ung dung quan ly thuc don an song kho voi Next.js + Prisma + SQLite.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Prisma + SQLite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Language:** JavaScript

## Features

- Tao thuc don tuan ngau nhien (7 ngay, 3 bua/ngay)
- Theo doi luong calo hang ngay
- Danh sach mua sam tu dong
- Cong thuc chi tiet voi nguyen lieu va cach lam
- Dang nhap/dang ky tai khoan
- Admin panel quan ly mon an

## Cai dat

```bash
# 1. Cai dependencies
npm install

# 2. Setup database
npx prisma db push

# 3. Seed du lieu
node prisma/seed.js

# 4. Chay dev server
npm run dev
```

## Admin Login

- Email: `admin@eatclean.com`
- Mat khau: `admin123`

## Cau hinh

File `.env`:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Scripts

```bash
npm run dev          # Chay development server
npm run build        # Build production
npm run start        # Start production server
npm run db:push      # Push schema to DB
npm run db:seed      # Seed du lieu
npm run db:studio    # Mo Prisma Studio
```
