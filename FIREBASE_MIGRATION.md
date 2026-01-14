# Firebase Migration Guide

This guide explains how to migrate from the Node.js/PostgreSQL backend to Firebase Firestore.

## What Changed

✅ **Backend removed** - No more Node.js/Express/PostgreSQL backend needed
✅ **Firestore database** - All data now stored in Firebase Firestore
✅ **Direct client access** - Frontend connects directly to Firestore
✅ **Security rules** - Firestore security rules ensure users can only access their own data

## Benefits

- 🚀 **Simpler deployment** - Only need to deploy frontend (Vercel)
- 💰 **Cost effective** - Firebase free tier is generous
- 🔒 **Built-in security** - Firestore security rules handle authentication
- ⚡ **Real-time updates** - Can easily add real-time features later
- 📱 **No backend maintenance** - No server to manage or update

## Setup Steps

### 1. Enable Firestore in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Firestore Database"** in the left sidebar
4. Click **"Create database"**
5. Choose **"Start in test mode"** (we'll add security rules next)
6. Select a location (choose closest to your users)
7. Click **"Enable"**

### 2. Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the default rules with the content from `firestore.rules` file
3. Click **"Publish"**

**Important:** The security rules ensure:
- Users can only read/write their own items
- All operations require authentication
- Data validation on create/update

### 3. Update Environment Variables (If Needed)

Your existing Firebase environment variables should work:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

**You can now remove:**
- `REACT_APP_API_URL` (no longer needed!)

### 4. Deploy Frontend

1. Push changes to GitHub
2. Vercel will automatically redeploy
3. No backend deployment needed!

## Data Migration (If You Have Existing Data)

If you have existing data in PostgreSQL that you want to migrate:

1. Export data from PostgreSQL:
   ```sql
   COPY (SELECT * FROM grocery_items) TO '/path/to/items.csv' CSV HEADER;
   ```

2. Use a script to import to Firestore:
   ```javascript
   // migration-script.js
   const admin = require('firebase-admin');
   const csv = require('csv-parser');
   const fs = require('fs');
   
   // Initialize Firebase Admin
   admin.initializeApp({
     credential: admin.credential.cert(require('./serviceAccountKey.json'))
   });
   
   const db = admin.firestore();
   
   // Read CSV and import
   fs.createReadStream('items.csv')
     .pipe(csv())
     .on('data', async (row) => {
       await db.collection('grocery_items').add({
         name: row.name,
         category: row.category,
         quantity: parseInt(row.quantity),
         price: parseFloat(row.price),
         expiration_date: row.expiration_date ? admin.firestore.Timestamp.fromDate(new Date(row.expiration_date)) : null,
         user_email: row.user_email,
         created_at: admin.firestore.Timestamp.fromDate(new Date(row.created_at)),
         updated_at: admin.firestore.Timestamp.fromDate(new Date(row.updated_at))
       });
     });
   ```

## Testing

1. Sign in with Google
2. Add a new item
3. Verify it appears in Firebase Console → Firestore Database
4. Check that you can only see your own items
5. Try editing and deleting items

## Troubleshooting

### Error: "Missing or insufficient permissions"

**Solution:** 
- Check Firestore security rules are published
- Verify user is authenticated (check Firebase Auth)
- Ensure `user_email` field matches authenticated user's email

### Error: "Firestore (9.x.x): The query requires an index"

**Solution:**
- Firebase will provide a link to create the index
- Click the link and create the index
- Wait a few minutes for index to build

### Items not appearing

**Check:**
1. Firestore security rules allow read access
2. User is authenticated
3. `user_email` field matches authenticated user's email
4. Check browser console for errors

## Firestore Queries

The current implementation uses client-side filtering for search. For better performance with large datasets, you can:

1. Create Firestore indexes for complex queries
2. Use Firestore's query operators (`where`, `orderBy`, etc.)
3. Implement pagination with `limit` and `startAfter`

## Cost Considerations

Firebase Firestore free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 1 GB storage

For most small to medium applications, this is sufficient. Monitor usage in Firebase Console.

## Next Steps

- ✅ Remove backend code (optional - can keep for reference)
- ✅ Remove `REACT_APP_API_URL` from Vercel environment variables
- ✅ Test all CRUD operations
- ✅ Monitor Firestore usage in Firebase Console

## Support

If you encounter issues:
1. Check Firebase Console for errors
2. Check browser console for detailed error messages
3. Verify Firestore security rules are correct
4. Ensure Firebase config environment variables are set
