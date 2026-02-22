---
name: managing-database-schemas
description: Use when designing database schemas, writing migrations, or optimizing queries in Supabase/PostgreSQL. Prevents N+1, missing indexes, and destructive migrations.
---

# Managing Database Schemas

## The Rule

**Every schema change goes through a migration file.** Never edit production directly. Index every column in WHERE/JOIN/ORDER BY. Fix N+1 with JOINs or `.select('*, relation(*)')`. Always write rollback migrations.

---

## Migrations (Supabase)

```sql
-- ✅ Versioned migration: supabase/migrations/20260221_add_profiles.sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (char_length(display_name) <= 100),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_profiles_created ON profiles(created_at DESC);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own" ON profiles FOR UPDATE USING (auth.uid() = id);
```

```bash
# supabase db push; supabase migration new
```

```sql
-- ❌ WRONG: Edit Dashboard directly, no RLS, no constraints
```

---

## N+1 Query Fix

```tsx
// ❌ WRONG: 1 query + N queries in loop = N+1
const orders = await supabase.from('orders').select('*')
for (const order of orders.data) {
  await supabase.from('users').select('*').eq('id', order.user_id)
}

// ✅ Single query with join
const { data } = await supabase
  .from('orders')
  .select('*, user:users(name, email)')
  .order('created_at', { ascending: false })
  .limit(20)
```

---

## Indexes

```sql
-- ✅ Index WHERE, JOIN, ORDER BY columns
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status) WHERE status = 'pending';
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- ❌ WRONG: No indexes or index every column
```

**When to index:** WHERE, JOIN ON, ORDER BY, GROUP BY with >10k rows.

---

## Connection Pooling

```bash
# ✅ Use Supavisor (port 6543)
# DATABASE_URL=postgres://user:pass@db.project.supabase.co:6543/postgres?pgbouncer=true

# ❌ WRONG: Direct connection (port 5432) exhausts 60 limit
```

---

## Zero-Downtime Migrations

```sql
-- ✅ Additive: ALTER TABLE users ADD COLUMN phone TEXT;

-- ✅ Rename in steps: Add → Backfill → Code update → Drop

-- ❌ WRONG: DROP COLUMN or ALTER SET NOT NULL (destructive)
```

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Edit schema in Dashboard | No version control, no rollback | Use migration files |
| N+1 queries in loop | 100 queries instead of 1 | JOIN or `.select('*, rel(*)')` |
| No indexes on WHERE cols | Full table scan, slow queries | `CREATE INDEX` on filtered cols |
| Direct connection from serverless | Connection limit exhausted | Use Supavisor (port 6543) |
| No RLS policies | Anyone reads/writes all data | `ENABLE RLS` + policies |
| Destructive migration | Data loss, downtime | Additive changes, multi-step |
| No foreign keys | Orphaned rows, data corruption | `REFERENCES table(id) ON DELETE CASCADE` |
