from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson.objectid import ObjectId

from app.core.deps import get_current_user
from app.db.mongodb import get_database
from app.models.user import UserInDB
from app.models.domain import Domain, DomainCreate
from app.services.cloudflare import CloudflareService
from app.worker.tasks import register_domain_task

router = APIRouter()

@router.post("/create", response_model=dict)
async def create_nameservers(
    domain_in: DomainCreate,
    background_tasks: BackgroundTasks,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    """
    Register a domain with Cloudflare and get nameservers.
    This is an async operation that will be processed in the background.
    """
    # Check if domain already exists
    existing_domain = await db.domains.find_one({"domain": domain_in.domain})
    if existing_domain:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This domain is already registered"
        )
    
    # Create a new domain record
    domain_id = str(ObjectId())
    domain_doc = {
        "_id": domain_id,
        "user_id": current_user.id,
        "domain": domain_in.domain,
        "nameservers": [],
        "created_at": None  # Will be set when the task completes
    }
    
    await db.domains.insert_one(domain_doc)
    
    # Start async task to register domain with Cloudflare
    task_id = register_domain_task.delay(domain_id, current_user.id, domain_in.domain)
    
    # Create task record
    task_doc = {
        "_id": str(ObjectId()),
        "task_id": str(task_id),
        "user_id": current_user.id,
        "status": "pending",
        "result": None,
        "error": None
    }
    
    await db.tasks.insert_one(task_doc)
    
    return {
        "message": "Domain registration started",
        "domain_id": domain_id,
        "task_id": str(task_id)
    }

@router.get("/{domain}", response_model=Domain)
async def get_nameservers(
    domain: str,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    """
    Get nameservers for a registered domain.
    """
    domain_doc = await db.domains.find_one({
        "domain": domain,
        "user_id": current_user.id
    })
    
    if not domain_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Domain not found"
        )
    
    return domain_doc

@router.delete("/{domain}", response_model=dict)
async def delete_nameservers(
    domain: str,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    """
    Delete a domain from Cloudflare.
    """
    domain_doc = await db.domains.find_one({
        "domain": domain,
        "user_id": current_user.id
    })
    
    if not domain_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Domain not found"
        )
    
    # Delete from Cloudflare
    cloudflare = CloudflareService()
    result = await cloudflare.delete_domain(domain)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete domain from Cloudflare: {result['error']}"
        )
    
    # Delete from database
    await db.domains.delete_one({"_id": domain_doc["_id"]})
    
    return {"message": "Domain deleted successfully"}

@router.get("/", response_model=List[Domain])
async def list_domains(
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    """
    List all domains registered by the current user.
    """
    domains = await db.domains.find({"user_id": current_user.id}).to_list(1000)
    return domains