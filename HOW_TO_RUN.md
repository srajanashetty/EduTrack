# EduTrack - How to Run

This project consists of a **Spring Boot Backend** and a **React Frontend**.
The database is hosted on **TiDB Cloud** (public cloud MySQL) — no local MySQL installation needed.

## Prerequisites

- **Java 21** is bundled in the `backend/jdk-21.0.2` folder (no system Java needed).
- **Maven** (`mvn`) must be available in your system PATH.
- **Node.js** must be installed for the frontend.

---

## 1. Start the Backend (with TiDB Cloud)

The backend connects to TiDB Cloud automatically using the credentials baked into `application.properties`.

### Option A — Use the launch script (easiest)
1. Open a terminal in VS Code and navigate to the backend folder:
   ```powershell
   cd c:\Users\sraja\OneDrive\Desktop\student\backend
   ```
2. Run the startup script:
   ```powershell
   .\start.ps1
   ```

### Option B — Manual command (all on one line)
```powershell
$env:JAVA_HOME="C:\Users\sraja\OneDrive\Desktop\student\backend\jdk-21.0.2"; `
$env:DB_URL="jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl-mode=REQUIRED&allowPublicKeyRetrieval=true&serverTimezone=UTC"; `
$env:DB_USERNAME="2CX5dYVXxEY8CVP.root"; `
$env:DB_PASSWORD="FLbz6SbBeuNb790R"; `
mvn spring-boot:run
```

3. Wait for: `Started EdutrackApplication in X seconds` on port **8080**. Leave this terminal open!

---

## 2. Start the Frontend

1. Open a **second** terminal in VS Code.
2. Navigate to the frontend:
   ```powershell
   cd c:\Users\sraja\OneDrive\Desktop\student\frontend
   ```
3. Run the development server:
   ```powershell
   npm run dev
   ```
4. Open your browser and go to: **http://localhost:5173**

---

## Database Info

| Property | Value |
|---|---|
| Provider | TiDB Cloud (AWS ap-southeast-1) |
| Host | gateway01.ap-southeast-1.prod.aws.tidbcloud.com |
| Port | 4000 |
| Database | test |
| Username | 2CX5dYVXxEY8CVP.root |
