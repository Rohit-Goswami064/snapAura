# Vercel Deployment Guide for SnapAura

## Issue: Black/Dark Blue Page on Vercel

If you see a black or dark blue page on Vercel, it's likely due to missing environment variables. Follow this guide to fix it.

## ✅ What I've Done

1. **Created `vercel.json`** - This file ensures proper routing for your Single Page Application (SPA)

## 🔧 Steps to Fix Your Deployment

### 1. Add Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add these:

#### Firebase Configuration

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Google OAuth (Optional, for login feature)

```
GOOGLE_CLIENT_ID=your_google_client_id
```

#### Gemini API (Optional, for AI features)

```
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Where to Get These Values

#### Firebase Configuration:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ → Project Settings
4. Scroll down to "Your apps" section
5. Copy the values from the `firebaseConfig` object

#### Google OAuth Client ID:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Find your OAuth 2.0 Client ID
5. Copy the Client ID

### 3. Redeploy

After adding the environment variables:

1. Go to **Deployments** tab in Vercel
2. Click the three dots ⋮ on the latest deployment
3. Click **Redeploy**
4. Or simply push a new commit to trigger a deployment

## 🚨 Important Notes

- **All environment variables must start with `VITE_`** for Vite to expose them to the browser (except GOOGLE_CLIENT_ID and GEMINI_API_KEY which are handled differently)
- Environment variables need to be added to **all environments** (Production, Preview, Development)
- After adding environment variables, you **must redeploy** for changes to take effect

## 🔍 Debugging

If the page is still blank after adding environment variables:

1. **Check Browser Console:**

   - Open your deployed site
   - Press F12 to open DevTools
   - Check the Console tab for errors
   - Look for Firebase initialization errors

2. **Check Vercel Build Logs:**

   - Go to your Vercel project
   - Click on the latest deployment
   - Check the "Build Logs" for any errors

3. **Common Issues:**
   - Missing `VITE_FIREBASE_API_KEY` → Firebase fails to initialize
   - Incorrect Firebase config → Authentication won't work
   - Missing `vercel.json` → Routes don't work (already fixed ✅)

## 📝 Test Locally First

Before deploying, test locally with your environment variables:

1. Create a `.env` file in your project root (don't commit this!)
2. Add all the variables from above
3. Run `npm run build` to test the production build
4. Run `npm run preview` to preview the build
5. If it works locally, it should work on Vercel with the same variables

## ✅ Checklist

- [ ] Added all Firebase environment variables in Vercel
- [ ] Added Google OAuth Client ID (if using login)
- [ ] Environment variables are set for Production environment
- [ ] Redeployed the project
- [ ] Checked browser console for errors
- [ ] Verified `vercel.json` exists in project root

## 🎉 Success!

Once deployed correctly, you should see:

- Landing page with gradient background
- "SnapAura" logo in the header
- "Get Started" button
- Upload area with drag & drop

---

**Need Help?** Check the Vercel build logs or browser console for specific error messages.
