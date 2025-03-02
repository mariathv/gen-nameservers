import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, nameservers, tasks
from app.core.rate_limiter import RateLimitMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Cloudflare Nameserver Generator API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware
app.add_middleware(RateLimitMiddleware)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(nameservers.router, prefix="/nameservers", tags=["Nameservers"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])

@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "healthy", "message": "Cloudflare Nameserver Generator API is running"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)