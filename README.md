# Onam Festival Dashboard

A plain React dashboard to manage Onam participants, programs, teams and scoring. All data is stored in a Google Sheet with four sheets: **Programs**, **Participants**, **Teams** and **Scoring**. A Google Apps Script web app serves as the backend API.

## Folder structure

```
Onam/
├── apps-script/
│   └── Code.gs          # Paste this into Google Apps Script
├── public/              # Static assets only
├── src/
│   ├── components/      # React components + CSS Modules
│   ├── services/
│   │   └── sheetApi.js  # API client
│   ├── config.js        # Apps Script URL
│   ├── App.jsx
│   └── index.jsx
├── index.html           # Vite entry HTML
├── package.json
├── README.md
└── vite.config.js
```

## Quick start (React app)

1. Install Node.js (v16+ recommended).
2. Open a terminal in `Onam/`.
3. Run:

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

## Google Setup

### 1. Create the Google Sheet

- Go to [Google Sheets](https://sheets.google.com) and create a spreadsheet.
- Copy the spreadsheet ID from the URL:

```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

### 2. Add Apps Script

- Open the spreadsheet and click **Extensions → Apps Script**.
- Delete the default `Code.gs` content and paste everything from `apps-script/Code.gs`.
- Replace `YOUR_SPREADSHEET_ID` in `FALLBACK_ID` with your copied spreadsheet ID (or leave it blank to auto-create a new sheet).
- Save the project (`Ctrl+S` / `Cmd+S`).

### 3. Initialize the sheets

- In the Apps Script editor, select the `setupSheets` function and click **Run**.
- Authorize the script when asked.
- This creates the four sheets with correct headers.

### 4. Deploy as web app

- Click **Deploy → New deployment**.
- Choose type **Web app**.
- Set:
  - **Execute as**: Me
  - **Who has access**: Anyone
- Click **Deploy** and copy the web app URL.

### 5. Connect the dashboard

- Open `src/config.js` and replace `YOUR_SCRIPT_ID` with the deployed web app URL:

```js
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/SCRIPT_ID/exec';
```

- Restart the React app (`npm run dev`).

## Sheets layout

The script creates these sheets automatically:

| Sheet | Columns |
|-------|---------|
| **Programs** | ID, Name, Category, Type, MaxParticipants, Description |
| **Participants** | ID, Name, TeamID, Contact, Gender, Age |
| **Teams** | ID, Name, Color, Captain |
| **Scoring** | ID, ProgramID, ParticipantID, TeamID, Judge, Score, Remarks, Timestamp |

## Features

- Dashboard with live counts and latest scores.
- Add, edit, delete programs, participants, teams and scores.
- Scoring supports both individual and team programs.
- Leaderboard shows top participants, top teams and program-wise results.
- Warm Onam-themed UI built with CSS Modules.

## Production build

```bash
npm run build
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, etc.).

## Migrating from react-scripts

If you already ran `npm install` with the old `react-scripts` setup:

1. Delete `node_modules` and `package-lock.json`.
2. Delete `public/index.html` (Vite uses the root `index.html`).
3. Run `npm install` again.

## Notes

- The first time you run the Apps Script it may ask for authorization. Choose the Google account and accept the permissions.
- If you want to allow only logged-in users, set **Who has access** to your organization and ensure users sign in.
