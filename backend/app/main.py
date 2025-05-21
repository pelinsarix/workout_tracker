# Main FastAPI application
from fastapi import FastAPI
from app.api.api_v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/ping")
def pong():
    """
    Sanity check.

    This will let the user know that the service is operational.
    And this path operation will: 
    * show up in the OpenAPI UI
    * be included in the generated client code
    """
    return {"ping": "pong!"}
