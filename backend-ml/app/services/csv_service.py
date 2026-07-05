import io
import pandas as pd
# pyrefly: ignore [missing-import]
from fastapi import HTTPException, status

class CSVService:
    @staticmethod
    def parse_and_validate_csv(file_bytes: bytes) -> tuple[list[str], list[float]]:
        """
        Reads CSV file bytes, validates headers, and extracts
        matching dates and occupancy records.
        """
        try:
            # Load file in-memory
            df = pd.read_csv(io.BytesIO(file_bytes))
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse CSV file: {str(e)}"
            )

        # Clean column headers
        df.columns = [col.strip().lower() for col in df.columns]

        # Verify required columns exist
        if "date" not in df.columns or "occupancy" not in df.columns:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CSV must contain both 'date' and 'occupancy' columns."
            )

        # Drop rows with null dates or occupancy
        df = df.dropna(subset=["date", "occupancy"])

        # Extract values
        dates = df["date"].astype(str).tolist()
        try:
            occupancy = df["occupancy"].astype(float).tolist()
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Occupancy values must be numerical."
            )

        if not dates:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CSV contains no valid records."
            )

        return dates, occupancy
