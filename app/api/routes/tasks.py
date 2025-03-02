from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import get_current_user
from app.db.mongodb import get_database
from app.models.user import UserInDB
from app.models.task import Task
from app.worker.celery_app import celery_app

router = APIRouter()

@router.get("/status/{task_id}", response_model=dict)
async def get_task_status(
    task_id: str,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    """
    Check the status of an async task.
    """
    # Check if task exists in database
    task_doc = await db.tasks.find_one({
        "task_id": task_id,
        "user_id": current_user.id
    })
    
    if not task_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # If task is still pending, check Celery
    if task_doc["status"] == "pending":
        celery_task = celery_app.AsyncResult(task_id)
        
        if celery_task.state == "PENDING":
            return {"status": "pending", "message": "Task is still processing"}
        
        elif celery_task.state == "SUCCESS":
            # Update task in database
            await db.tasks.update_one(
                {"task_id": task_id},
                {"$set": {"status": "success", "result": celery_task.result}}
            )
            return {"status": "success", "result": celery_task.result}
        
        elif celery_task.state == "FAILURE":
            # Update task in database
            await db.tasks.update_one(
                {"task_id": task_id},
                {"$set": {"status": "failure", "error": str(celery_task.result)}}
            )
            return {"status": "failure", "error": str(celery_task.result)}
        
        else:
            return {"status": celery_task.state, "message": "Task is in progress"}
    
    # Return task status from database
    return {
        "status": task_doc["status"],
        "result": task_doc.get("result"),
        "error": task_doc.get("error")
    }