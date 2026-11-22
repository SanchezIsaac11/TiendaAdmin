# TiendaAdmin POS

### 1. Configure Environment Variables

The backend requires environment variables to run properly.
1. Navigate to the `backend` folder.
2. Locate the `.env.example` file.
3. Create a copy of this file and rename it to `.env`.
4. Fill in the required environment variables with the appropriate values.

**Note:** To enable session-based authentication, you must configure the `ALLOWED_ORIGINS` variable in the backend's `.env` file.
Add the localhost IP addresses used to access the frontend.

For example:
```
ALLOWED_ORIGINS=http://localhost:5500
```

**Important:** In this first version, both the frontend and backend must run on the same host (localhost). The frontend's origin must be included in `ALLOWED_ORIGINS` for authentication cookies and session management to work correctly.

### 3. Run the Backend
From the `backend` folder, execute:
```
npm run dev
```

### 4. Run the Frontend
1. Open the `frontend` folder in Visual Studio Code.
2. Locate the `index.html` file.
3. Click **Go Live**.
