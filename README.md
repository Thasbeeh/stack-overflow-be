# 🚀 Stack Overflow Backend (NestJS)

A scalable backend system inspired by Stack Overflow, built with **NestJS**, focusing on clean architecture, background job processing, and production-grade patterns.

---

## 🧠 Overview

This project demonstrates how to design and build a **real-world backend system** with:

* Modular architecture (NestJS)
* Asynchronous job processing (BullMQ + Redis)
* Robust database layer (PostgreSQL + Prisma)
* Failure handling & retry strategies
* Scalable and maintainable code structure

---

## ⚙️ Tech Stack

* **Framework**: NestJS (Node.js, TypeScript)
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Queue**: BullMQ
* **Cache / Broker**: Redis
* **Testing**: Jest

---

## 🏗️ Architecture

```text
Client
  ↓
API Layer (Controllers)
  ↓
Service Layer (Business Logic)
  ↓
Repository Layer (Prisma)
  ↓
Database (PostgreSQL)

Async Flow:
Service → Queue (BullMQ) → Worker → External Side Effects
```

---

## 🔄 Background Job Processing

### 📌 Use Cases

* Sending emails (welcome, notifications)
* Async processing (decoupled from API latency)
* Retry handling for transient failures

### ⚙️ Flow

```text
User Service
   ↓ enqueue job
Redis (BullMQ Queue)
   ↓
Worker (Processor)
   ↓
Execute task (email, notification, etc.)
```

---

## ❗ Failure Handling Strategy

* **Retries with exponential backoff**
* **Error classification (retryable vs non-retryable)**
* **Dead Letter Queue (DLQ)** for exhausted retries
* **Worker event listeners** for observability

---

## 🔒 Reliability Considerations

* **At-least-once delivery** (BullMQ guarantee)
* **Idempotent job processing** to prevent duplicates
* **Redis-based locking** to avoid concurrent execution
* **DLQ for recovery and debugging**

---

## 📦 Queue Design

* `email-queue` → handles email jobs
* `dead-email` → stores failed jobs for inspection

Each queue has:

* Dedicated processor
* Independent retry strategy
* Isolated failure handling

---

## 🧪 Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/db
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Start Redis

```bash
redis-server
```

### 5. Start application

```bash
npm run start:dev
```

---

## 🔍 Debugging Queues (Redis CLI)

```bash
LRANGE bull:email-queue:wait 0 -1
ZRANGE bull:email-queue:failed 0 -1
HGETALL bull:email-queue:<jobId>
```

---

## 🚨 Key Design Decisions

* Separation of concerns: API vs background processing
* Processor handles failures, not services
* DLQ ensures no job is silently lost
* Modular queue design for scalability

---

## 📈 Future Improvements

* Outbox Pattern for DB + Queue consistency
* Queue monitoring UI (Bull Board)
* Rate limiting & priority queues
* Distributed worker scaling

---

## 🎯 What This Project Demonstrates

* Real-world backend architecture
* Async processing with reliability guarantees
* Clean, maintainable, and scalable code design
* Strong alignment with production backend systems
