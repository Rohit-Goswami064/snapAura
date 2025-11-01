# SnapAura ✨

SnapAura is a powerful and intuitive web application for creating beautiful, professional-looking screenshots. Customize backgrounds with gradients, images, or videos, adjust corner radius, add shadows, and overlay text with ease. Perfect for designers, developers, and marketers.

![SnapAura Landing Page](https://i.imgur.com/LhBkvg1.png)

## 🚀 Key Features

- **Custom Backgrounds:** Choose from solid colors, stunning gradients, images, or even animated GIFs.
- **Image Styling:** Fine-tune padding, corner radius, and add beautiful, configurable drop shadows.
- **Browser Frames:** Wrap your screenshot in a clean, minimalist browser frame (Light & Dark modes available).
- **Overlays:** Add and style text, emojis, and stickers/GIFs directly onto your canvas.
- **Interactive Editor:** Drag, resize, and edit all overlays with an intuitive on-canvas interface.
- **Google Sign-In:** Securely log in to save and manage your creations (requires configuration).
- **High-Resolution Export:** Download your final creation as a high-quality PNG image.
- **Drag & Drop:** Easily upload your screenshots by dragging them directly onto the canvas.

## Getting Started

To run SnapAura on your local machine, follow these steps.

### Prerequisites

- **Node.js** (v16 or higher) and **npm** - [Download Node.js](https://nodejs.org/)
- A modern web browser like Chrome, Firefox, or Safari.
- A code editor for making changes.

### Installation & Running

1.  **Install Dependencies:** Navigate to the project folder in your terminal and run:

    ```bash
    npm install
    ```

2.  **Start the Development Server:** Run the following command:

    ```bash
    npm run dev
    ```

3.  **View in Browser:** Open your web browser and go to `http://localhost:3000` (or the URL shown in your terminal).

## 🔐 Configuring Google Sign-In

The Google Sign-In functionality requires a Google Client ID to be configured. Follow these steps to set it up:

### Step 1: Get a Google Client ID

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Choose **Web application** as the application type.
6. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000` (for local development)
   - Your production URL (when deploying)
7. Click **Create**, and copy the **Client ID** that is generated.

### Step 2: Configure the Client ID

1. Create a `.env` file in the root directory of the project (if it doesn't already exist).
2. Add your Google Client ID to the `.env` file:

   ```env
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

   Replace `your-client-id-here` with your actual Client ID.

3. **Important:** Restart your development server for the changes to take effect:
   ```bash
   # Stop the current server (Ctrl+C), then:
   npm run dev
   ```

### Step 3: Verify Setup

Once configured and the server is restarted:

- The "Login" button in the topbar should become active (not disabled).
- Clicking "Login" should open the Google Sign-In prompt.
- After signing in, your profile picture and name should appear in the topbar.

### Troubleshooting

If Google Sign-In is not working:

1. **Check the `.env` file:**

   - Ensure the file exists in the project root directory.
   - Verify the Client ID is correct and doesn't have extra spaces or quotes.
   - Format should be: `GOOGLE_CLIENT_ID=181701112991-xxxxx.apps.googleusercontent.com`

2. **Restart the dev server:**

   - Environment variables are only loaded when the server starts.
   - Stop the server (Ctrl+C) and run `npm run dev` again.

3. **Check browser console:**

   - Open browser DevTools (F12) and check the Console tab for error messages.
   - Look for messages like "Google Sign-In script failed to load" or "Google Sign-In is not configured".

4. **Verify Google Cloud Console settings (CRITICAL - Most Common Issue):**

   - If you see the error: `[GSI_LOGGER]: The given origin is not allowed for the given client ID` or `403 (Forbidden)`, this means your current URL is not authorized.
   - Check the exact URL in your browser's address bar (e.g., `http://localhost:3000`, `http://127.0.0.1:3000`, `http://localhost:5173`, etc.).
   - Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
   - Click on your OAuth 2.0 Client ID.
   - Under **Authorized JavaScript origins**, add the EXACT URL you're using (including the protocol `http://` or `https://` and port number).
   - Common origins to add:
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`
     - `http://localhost:5173` (if Vite uses default port)
   - Click **Save** and wait 1-2 minutes for changes to propagate.
   - Make sure the OAuth consent screen is configured correctly.

5. **Check network connectivity:**
   - Ensure the Google Sign-In script can load from `https://accounts.google.com/gsi/client`.
   - Check if any browser extensions or firewalls are blocking the script.
# snapAura
