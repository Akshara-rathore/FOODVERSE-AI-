import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.database import engine, Base
from app.api.v1.api import api_router

setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing FoodVerse AI Backend...")
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database schemas verified.")
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    yield
    logger.info("Shutting down FoodVerse AI Backend.")


app = FastAPI(
    title="FoodVerse AI Platform",
    description="Full-stack AI-powered food intelligence platform: food recognition, nutrition analysis, freshness assessment, kitchen hygiene auditing, cooking assistance, and multimodal guidance.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded media safely
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."}
    )


# Include Versioned API Router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "service": "FoodVerse AI Platform",
        "status": "operational",
        "documentation": "/docs",
        "api_v1": "/api/v1"
    }
