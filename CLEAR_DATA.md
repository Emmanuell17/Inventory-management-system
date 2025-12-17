# Clear All Items from Database

If you need to clear all items from the database, run:

```bash
psql -U Emmanuel -d inventory_db -c "DELETE FROM transactions; DELETE FROM items; ALTER SEQUENCE items_id_seq RESTART WITH 1;"
```

Or if there's no transactions table:

```bash
psql -U Emmanuel -d inventory_db -c "DELETE FROM items; ALTER SEQUENCE items_id_seq RESTART WITH 1;"
```



