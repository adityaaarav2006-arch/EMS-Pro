from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client : AsyncIOMotorClient = None

db = None

def get_db():
    return client[settings.DB_NAME]

async def connect_db():
    try:
        global client,db
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        await client.admin.command("ping")
        db = client[settings.DB_NAME]
        print(f"CONNECTED TO MONGO DB SERVER : {settings.DB_NAME}")
    except Exception as e:
        print(f"CONNECTION FAILED TO MONGO DB SERVER : {e}")
        raise e

async def close_db():
    global client
    if client:
        client.close()
        print("MONGODB IS DISCONNECTED")