from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL : str
    DB_NAME : str
    SECRET_KEY : str
    ALGORITHM : str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES : int = 30
    GEMINI_API_KEY : str
    CORS_ORIGIN : str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"

settings = Settings()