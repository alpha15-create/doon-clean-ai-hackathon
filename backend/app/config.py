import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "DoonClean AI Backend"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"

    # Database
    DATABASE_URL: str = Field(
        default="sqlite:///./doonclean.db",
        description="PostgreSQL URL (e.g. Supabase) or local SQLite fallback"
    )

    # Supabase Storage
    SUPABASE_URL: str = Field(default="", description="Supabase project URL")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(default="", description="Supabase service role key")
    SUPABASE_STORAGE_BUCKET: str = Field(default="waste-reports", description="Storage bucket name")

    # Security & Auth
    SECRET_KEY: str = Field(
        default="doonclean_ai_super_secret_jwt_key_for_hackathon_demo_2026",
        description="JWT secret key"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # AI Model Configuration
    AI_MODE: str = Field(default="mock", description="'mock' or 'yolo'")
    AI_MODEL_PATH: str = Field(default="models/waste_detector.pt", description="Path to YOLO weights")

    # Uploads
    MAX_UPLOAD_SIZE_MB: int = 10
    UPLOAD_DIR: str = "uploads"

    # CORS
    CORS_ORIGINS: str = Field(
        default="http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173",
        description="Comma-separated CORS origins"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def effective_database_url(self) -> str:
        # Supabase sometimes provides 'postgres://', SQLAlchemy 2.x requires 'postgresql://'
        url = self.DATABASE_URL.strip() if self.DATABASE_URL else "sqlite:///./doonclean.db"
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

settings = Settings()
