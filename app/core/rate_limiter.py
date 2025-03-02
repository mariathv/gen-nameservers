import time
from typing import Dict, Tuple
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.status import HTTP_429_TOO_MANY_REQUESTS
from app.core.config import settings

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.rate_limit_per_minute = settings.RATE_LIMIT_PER_MINUTE
        self.clients: Dict[str, Tuple[int, float]] = {}  # IP: (count, start_time)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Skip rate limiting for certain paths
        if request.url.path in ["/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
        
        # Check if client exists and if the minute has passed
        if client_ip in self.clients:
            count, start_time = self.clients[client_ip]
            # Reset if a minute has passed
            if current_time - start_time > 60:
                self.clients[client_ip] = (1, current_time)
            else:
                # Increment count
                count += 1
                if count > self.rate_limit_per_minute:
                    return Response(
                        content="Rate limit exceeded. Please try again later.",
                        status_code=HTTP_429_TOO_MANY_REQUESTS
                    )
                self.clients[client_ip] = (count, start_time)
        else:
            # New client
            self.clients[client_ip] = (1, current_time)
        
        return await call_next(request)