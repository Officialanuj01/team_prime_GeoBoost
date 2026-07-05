# Use an official lightweight Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

# Set the working directory in the container
WORKDIR /workspace

# Install minimal build dependencies (if needed by compiled python dependencies)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies first for layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the application source code
COPY . .

# Expose Cloud Run default port
EXPOSE 8080

# Start FastAPI application using uvicorn through Python module invocation
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]

