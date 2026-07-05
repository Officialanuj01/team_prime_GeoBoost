# GeoBoost ML Orchestrator Backend

A minimal, high-performance FastAPI backend designed to orchestrate requests between GeoBoost dashboard users and a pre-deployed Google TimesFM 2.5 time series model on Vertex AI.

---

## 1. Local Setup

### Step 1: Create Virtual Environment
Run the following command inside the `backend-ml` directory:
```bash
python -m venv .venv
```

### Step 2: Activate Environment
- **Windows (Command Prompt):**
  ```cmd
  .venv\Scripts\activate.bat
  ```
- **macOS / Linux:**
  ```bash
  source .venv/bin/activate
  ```

### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

---

## 2. Google Cloud Setup & Authentication

### Step 4: Install Google Cloud CLI
If you do not have the `gcloud` CLI installed, follow the official installation guide:
👉 [Google Cloud CLI Installer Guide](https://cloud.google.com/sdk/docs/install)

### Step 5: Authenticate Locally (ADC)
Run this command in your terminal:
```bash
gcloud auth application-default login
```

#### What does this command do?
- It opens a browser window where you log in using your Google account that has permissions to call your Vertex AI Endpoint.
- It generates a secure local credential profile token.
- No raw JSON keys need to be saved inside the codebase or shared on developer workspaces, improving security.

#### Where are credentials stored?
- **macOS/Linux:** `~/.config/gcloud/application_default_credentials.json`
- **Windows:** `%APPDATA%\gcloud\application_default_credentials.json`

The `google-cloud-aiplatform` library automatically locates this file during runtime.

---

## 3. Configuration

### Step 6: Create your Environment File
1. Copy the template:
   ```bash
   cp .env.example .env
   ```
2. Fill in your project credentials:
   - `GOOGLE_CLOUD_PROJECT_ID`: Your GCP project identifier.
   - `VERTEX_ENDPOINT_ID`: The deployed endpoint ID.
   - `VERTEX_LOCATION`: Region of endpoint deployment (e.g. `asia-south1`).

---

## 4. Run Application

### Step 7: Launch Server
Start the development server with live reloading:
```bash
uvicorn app.main:app --reload --port 8000
```

### Step 8: Test Endpoint
1. Open the interactive OpenAPI documentation:
   👉 [http://localhost:8000/docs](http://localhost:8000/docs)
2. Open the **`POST /forecast`** endpoint.
3. Click **"Try it out"**.
4. Choose an input CSV file matching the schema:
   ```csv
   date,occupancy
   2026-07-01,62
   2026-07-02,64
   2026-07-03,65
   ```
5. Click **"Execute"** to get raw predictions returned by the TimesFM endpoint.
