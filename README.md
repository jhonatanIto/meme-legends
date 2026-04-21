# 🧢 MEME-LEGENDS

E-commerce platform built for meme-inspired apparel.

The project is designed with a modern full-stack architecture using serverless-ready services, background workers, and third-party fulfillment integrations.

---

## 🚀 Tech Stack

### Frontend

- Next.js (App Router)
- Tailwind CSS

### Backend

- Next.js API Routes
- Node.js Workers (separate process)

### Database

- PostgreSQL (Neon)
- Drizzle ORM

### Infrastructure

- Redis (queue system)
- Background Workers (async jobs processing)

### Payments & Fulfillment

- Stripe (payments & subscriptions)
- Printify (print-on-demand fulfillment)

---

## 🏗️ Architecture Overview

The system is built with a separation of concerns:

- **Next.js App** → frontend + API routes
- **Redis Queue** → job orchestration
- **Workers** → async processing (orders, Stripe webhooks, Printify order creation)
- **PostgreSQL (Neon)** → persistent data storage
- **Stripe** → payment processing and charge management
- **Printify** → product production and shipping automation

This allows scalable order processing without blocking user requests.

---

## ⚙️ Features

- 🛒 E-commerce store with cart system
- 💳 Stripe checkout integration
- 📦 Automatic Printify order creation
- ⚡ Background job processing with Redis + workers
- 📊 Order tracking system
- 🧾 Database persistence with Drizzle ORM
- 🔐 Secure payment flow handling
- 📱 Fully responsive UI with Tailwind CSS
