# Firebase Authentication Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "veltra-stock")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Google Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable** switch
4. Enter your project support email
5. Click **Save**

## Step 3: Register Web App

1. In Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Register your app:
   - App nickname: "Veltra Stock Web"
   - Check "Also set up Firebase Hosting" (optional)
   - Click **Register app**
3. Copy the Firebase configuration object

## Step 4: Add Environment Variables

1. In your project, create a `.env` file in the `frontend` folder:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder values with your Firebase config:
   ```
   REACT_APP_FIREBASE_API_KEY=AIzaSy...
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

## Step 5: Install Dependencies

```bash
cd frontend
npm install
```

This will install Firebase SDK (already added to package.json).

## Step 6: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your domains:
   - `localhost` (already included for development)
   - Your production domain (when deploying)

## Step 7: Test the Integration

1. Start the frontend:
   ```bash
   npm start
   ```

2. Navigate to `http://localhost:3000`
3. Click "Sign in with Google"
4. Complete the Google sign-in flow
5. You should be redirected to the dashboard

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure `.env` file exists in the `frontend` folder
- Verify all environment variables are set correctly
- Restart the dev server after adding `.env` file

### "Firebase: Error (auth/unauthorized-domain)"
- Add `localhost` to authorized domains in Firebase Console
- Check Authentication > Settings > Authorized domains

### "Firebase: Error (auth/popup-closed-by-user)"
- User closed the sign-in popup (not an error, just inform user)

### Sign-in button not working
- Check browser console for errors
- Verify Firebase config values are correct
- Make sure Google sign-in method is enabled in Firebase Console

## Security Notes

- Never commit `.env` file to Git (already in `.gitignore`)
- Keep your Firebase API keys secure
- Use Firebase Security Rules to protect your data
- For production, use environment variables in your hosting platform

## Next Steps

After setup, users can:
- Sign in with their Google account
- Access the dashboard (protected route)
- Their profile picture and name will appear in the header
- Sign out to return to the home page



