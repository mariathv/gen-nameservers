import asyncio
from datetime import datetime
from bson.objectid import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

from app.worker.celery_app import celery_app
from app.core.config import settings
from app.services.cloudflare import CloudflareService

@celery_app.task(bind=True)
def register_domain_task(self, domain_id: str, user_id: str, domain: str):
    """
    Celery task to register a domain with Cloudflare.
    """
    # Create a new event loop for async operations
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    # Register domain with Cloudflare
    cloudflare = CloudflareService()
    result = loop.run_until_complete(cloudflare.register_domain(domain))
    
    if result["success"]:
        # Update domain in database
        loop.run_until_complete(
            db.domains.update_one(
                {"_id": domain_id},
                {
                    "$set": {
                        "nameservers": result["nameservers"],
                        "created_at": datetime.utcnow()
                    }
                }
            )
        )
        
        # Update task status
        loop.run_until_complete(
            db.tasks.update_one(
                {"task_id": self.request.id},
                {
                    "$set": {
                        "status": "success",
                        "result": {
                            "zone_id": result["zone_id"],
                            "nameservers": result["nameservers"]
                        },
                        "updated_at": datetime.utcnow()
                    }
                }
            )
        )
        
        return {
            "zone_id": result["zone_id"],
            "nameservers": result["nameservers"]
        }
    else:
        # Update task status
        loop.run_until_complete(
            db.tasks.update_one(
                {"task_id": self.request.id},
                {
                    "$set": {
                        "status": "failure",
                        "error": result["error"],
                        "updated_at": datetime.utcnow()
                    }
                }
            )
        )
        
        # Clean up the domain record
        loop.run_until_complete(
            db.domains.delete_one({"_id": domain_id})
        )
        
        raise Exception(f"Failed to register domain: {result['error']}")
    
    # Close MongoDB connection
    client.close()