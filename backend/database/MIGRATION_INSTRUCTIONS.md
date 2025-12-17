# Migration Instructions: Adding User-Specific Inventories

This migration adds user-specific inventory support so each user only sees their own items.

## Step 1: Run the Migration Script

Connect to your PostgreSQL database and run the migration script:

```bash
psql -U your_username -d inventory_db -f backend/database/add_user_email_column.sql
```

Or if you're already connected to the database:

```sql
\i backend/database/add_user_email_column.sql
```

## Step 2: Verify the Migration

Check that the column was added:

```sql
\d grocery_items
```

You should see `user_email` in the column list.

## Step 3: Handle Existing Data (Important!)

**Option A: Delete all existing items** (Recommended for fresh start)
```sql
DELETE FROM grocery_items;
```

**Option B: Assign existing items to a default user** (If you want to keep test data)
```sql
UPDATE grocery_items SET user_email = 'your-email@example.com' WHERE user_email IS NULL;
```

## Step 4: Restart Backend Server

After running the migration, restart your backend server:

```bash
cd backend
npm run dev
```

## What Changed?

- **Database**: Added `user_email` column to `grocery_items` table
- **Backend**: All API routes now require and filter by `user_email` from request headers
- **Frontend**: All API calls now include user email in `x-user-email` header

## Testing

1. Sign in with one email address
2. Add some items
3. Sign out and sign in with a different email address
4. You should see an empty inventory (no items from the previous user)



