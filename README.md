# YoYo Deals — Amazon Affiliate Website

A production-ready Amazon affiliate website built with **Next.js 14+ (App Router)**, **TailwindCSS**, **MongoDB Atlas**, **NextAuth.js**, and **Cloudinary**.

## Features

- 🏠 **Public Storefront** — Homepage, product pages, category pages with search/sort/pagination
- 🛡️ **Admin Panel** — Full product/category/subscriber CRUD with sidebar navigation
- 🔐 **Authentication** — NextAuth.js with JWT, rate-limited login
- 🌙 **Dark/Light Mode** — System-aware with manual toggle
- 📊 **Click Tracking** — Track affiliate link clicks per product
- 📧 **Newsletter** — Email subscription with CSV export
- 🖼️ **Cloudinary** — Image upload with auto-optimization
- 🔍 **SEO** — JSON-LD structured data, meta tags, semantic HTML
- 🔒 **Security** — Rate limiting, Zod validation, secure headers, XSS/CSRF protection

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_URL` | Your site URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_EMAIL` | Admin email for seed script |
| `ADMIN_PASSWORD` | Admin password for seed script |

### 3. Seed the database

```bash
npx tsx scripts/seed.ts
```

This creates:
- 5 sample categories
- 8 sample products
- 1 admin user

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Panel

Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and log in with the credentials from your `.env.local`.

## Project Structure

```
├── app/
│   ├── admin/          # Admin panel (login, dashboard, products, categories, subscribers)
│   ├── api/            # API routes (auth, admin CRUD, newsletter, click tracking, upload)
│   ├── category/       # Category pages
│   ├── product/        # Product detail pages
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/         # Shared components (Header, Footer, ProductCard, Newsletter, etc.)
├── lib/                # Utilities (MongoDB, auth, rate-limit, validations)
├── models/             # Mongoose models (Product, Category, Subscriber, Admin)
└── scripts/            # Seed script
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` to Vercel project settings
4. Deploy

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14+ | Full-stack React framework |
| TailwindCSS | Utility-first CSS |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| NextAuth.js | Authentication |
| Cloudinary | Image hosting |
| Zod | Input validation |
| bcryptjs | Password hashing |
