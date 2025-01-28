FROM python:3.8-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage cache
COPY app/requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Production image with minimal dependencies
FROM python:3.8-slim

WORKDIR /app

# Copy only the installed packages from builder
COPY --from=builder /install /usr/local

# Create app directory structure
RUN mkdir -p /app/app

# Copy application files preserving module structure
COPY app/ /app/app/

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Update the command to use the correct module path
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
