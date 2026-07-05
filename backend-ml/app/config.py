import os
from pathlib import Path
from dotenv import load_dotenv

# Load env variables from the root directory of backend-ml
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Config:
    GOOGLE_CLOUD_PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT_ID")
    VERTEX_LOCATION = os.getenv("VERTEX_LOCATION", "asia-south1")
    VERTEX_ENDPOINT_ID = os.getenv("VERTEX_ENDPOINT_ID")
    VERTEX_DEDICATED_ENDPOINT = os.getenv("VERTEX_DEDICATED_ENDPOINT")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    HORIZON = int(os.getenv("HORIZON", "7"))

    @classmethod
    def validate(cls):
        """Validates that crucial variables are set at startup."""
        missing = []
        if not cls.GOOGLE_CLOUD_PROJECT_ID:
            missing.append("GOOGLE_CLOUD_PROJECT_ID")
        if not cls.VERTEX_ENDPOINT_ID:
            missing.append("VERTEX_ENDPOINT_ID")
        if not cls.VERTEX_DEDICATED_ENDPOINT:
            missing.append("VERTEX_DEDICATED_ENDPOINT")
        if not cls.GEMINI_API_KEY:
            missing.append("GEMINI_API_KEY")
        
        if missing:
            raise ValueError(
                f"Missing required environment variables: {', '.join(missing)}. "
                "Please configure them in your .env file."
            )

# Run verification on load
Config.validate()
