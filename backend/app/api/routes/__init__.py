
from fastapi import APIRouter
from .insights import single, batch

# Create main router
router = APIRouter()

# Include all sub-routers
router.include_router(
    single.router,
    prefix="/insights",
    tags=["insights"]
)

router.include_router(
    batch.router,
    prefix="/insights",
    tags=["insights"]
)

