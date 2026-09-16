import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "DRISHTI"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    SECTOR: str = "NORTH SECTOR"
    BOP_CODE: str = "BOP-17"
    
    # Database: Default to local SQLite for zero-configuration, or PostGIS if POSTGRES_URL is provided
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./drishti.db")
    
    # Redis URL
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # MQTT Broker
    MQTT_BROKER: str = os.getenv("MQTT_BROKER", "localhost")
    MQTT_PORT: int = int(os.getenv("MQTT_PORT", "1883"))
    
    # Secret Key for JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "drishti-c4i-border-surveillance-secret-key-2026")
    
    # Map Tile Configuration
    MAP_STYLE_URL: str = os.getenv(
        "MAP_STYLE_URL",
        "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    )

settings = Settings()
