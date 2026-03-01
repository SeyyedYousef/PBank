# PBank Data Models: The "Distributed" Schema (DDD Edition)
> **Architecture:** Microservices (Polyglot Persistence)
> **Goal:** Isolation & Scalability

چون معماری ما "میکروسرویس" شد، دیگر یک دیتابیس غول‌پیکر نداریم. هر سرویس دیتابیس خودش را دارد.
(در طراحی DDD، به این‌ها **Bounded Contexts** می‌گویند).

---

## 1. سرویس هویت (Identity Service Context)
*   **Database:** PostgreSQL (Relation-Heavy)
*   **Owner:** Identity Team

```jsonc
// User Aggregate
{
  "user_id": "UUIDv7",
  "phone_hash": "SHA-256", // +93799...
  "kyc_level": "ENUM", // 'ANONYMOUS' | 'VERIFIED' | 'VIP'
  "auth_methods": [
    { "type": "BIOMETRIC", "public_key": "..." },
    { "type": "PIN", "salt": "..." }
  ]
}
```

---

## 2. سرویس کیف پول (Wallet Service Context)
*   **Database:** CockroachDB (Distributed SQL) or TigerBeetle (Financial Ledger)
*   **Owner:** Core Banking Team

اینجا "اطلاعات شخصی" کاربر وجود **ندارد**. فقط `user_id` و پول.

```jsonc
// Account Aggregate
{
  "account_id": "UUIDv7",
  "owner_id": "UUIDv7", // Foreign Key to Identity Service
  "currency": "AFN",
  "balance_nano": "BigInt", // 1000 AFN = 1000000000 nanos
  "sequence": "Integer", // prevents replay attacks
  "state": "ACTIVE"
}

// Transaction Ledger (Double-Entry Log)
{
  "txn_id": "UUIDv7",
  "debit_account_id": "UUIDv7",
  "credit_account_id": "UUIDv7",
  "amount_nano": "BigInt",
  "timestamp": "ISO_8601",
  "trace_id": "String" // For tracing across microservices
}
```

---

## 3. سرویس ابزارها (Utility Service Context)
*   **Database:** MongoDB / NoSQL (Flexible Documents)
*   **Owner:** Features Team

```jsonc
// Bill Aggregate
{
  "bill_id": "String",
  "provider": "BRESHNA",
  "account_number": "String", // Meter ID
  "last_paid_at": "Date",
  "is_auto_pay": "Boolean"
}
```

---

> **نکته مهم:**
> در میکروسرویس، اگر سرویس "ابزارها" بخواهد موجودی را بداند، حق ندارد به دیتابیس "کیف پول" سرک بکشد.
> باید یک درخواست (gRPC Request) بفرستد: *"سلام کیف پول، آیا یوزر X ۲۰۰ افغانی دارد؟"*
