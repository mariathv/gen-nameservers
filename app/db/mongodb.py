from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

# MongoDB client instance
client: AsyncIOMotorClient = None

async def connect_to_mongo():
    """Create database connection."""
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    # Create indexes for collections
    db = client[settings.MONGODB_DB_NAME]
    
    # Create unique index for users collection (email)
    await db.users.create_index("email", unique=True)
    
    # Create index for domains collection
    await db.domains.create_index("domain", unique=True)
    await db.domains.create_index("user_id")

async def close_mongo_connection():
    """Close database connection."""
    global client
    if client:
        client.close()

async def get_database() -> AsyncIOMotorDatabase:
    """Return database instance."""
    return client[settings.MONGODB_DB_NAME]