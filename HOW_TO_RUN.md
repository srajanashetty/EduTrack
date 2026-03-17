# edutrack - How to Run

This project consists of a **Spring Boot Backend** and a **React Frontend**. Follow these steps to start both.

## Prerequisites

- **MySQL Server** must be running on your machine.
- Your MySQL password is configured as `srajana@2611`. 

---

## 1. Start the Backend

Because the `lombok` dependency does not currently support Java 25 (which is the system-wide Java version installed on your device), you must run the backend using the embedded **Java 21** that was downloaded into the backend folder (`jdk-21.0.2`).

1. Open a new terminal in VS Code (or PowerShell).
2. Change your directory to the `backend` folder:
   ```powershell
   cd c:\Users\sraja\OneDrive\Desktop\student\backend
   ```
3. Run the following command (all on one line) to temporarily point your terminal to Java 21 and start the Spring Boot server:
   ```powershell
   $env:JAVA_HOME="C:\Users\sraja\OneDrive\Desktop\student\backend\jdk-21.0.2"; mvn spring-boot:run
   ```
4. Wait for it to say `Started edutrackApplication in X seconds` on port `8080`. Leave this terminal open!

---

## 2. Start the Frontend

Once the backend is running, you need to spin up the React application.

1. Open a **second** terminal window in VS Code (click the `+` button in the terminal panel).
2. Change your directory to the `frontend` folder:
   ```powershell
   cd c:\Users\sraja\OneDrive\Desktop\student\frontend
   ```
3. Run the development server:
   ```powershell
   npm run dev
   ```
4. The frontend will start locally. You can access the app by opening your browser and going to:
   **http://localhost:5173**
