# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.api.forecast import router as forecast_router

# Create app instance
app = FastAPI(
    title="GeoBoost ML Orchestrator API",
    description="Minimal FastAPI wrapper connecting to pre-deployed Vertex AI TimesFM 2.5 endpoint",
    version="1.0.0"
)

# Set up CORS middleware to allow cross-origin requests from frontend dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust for production security if necessary
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include endpoint routes
app.include_router(forecast_router, tags=["Forecasting"])

@app.get("/health", tags=["System Checks"])
def health_check():
    """Simple verification route to test if the service is online."""
    return {"status": "healthy", "service": "GeoBoost ML Backend"}
