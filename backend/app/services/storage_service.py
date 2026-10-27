import os
import uuid
from typing import Tuple, List, Optional
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings
from app.core.logging import logger


class StorageService:
    def __init__(self):
        self.upload_dir = os.path.abspath(settings.UPLOAD_DIR)
        os.makedirs(self.upload_dir, exist_ok=True)

    def validate_file(self, file: UploadFile) -> Tuple[str, str]:
        """Validate filename, extension, and content type."""
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file must have a valid filename."
            )
        
        ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
        if ext not in settings.allowed_extension_list:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format '.{ext}'. Allowed: {', '.join(settings.allowed_extension_list)}"
            )
        return file.filename, ext

    async def save_upload_file(self, file: UploadFile, max_size_mb: Optional[int] = None) -> Tuple[str, str, bytes]:
        """Save file securely with UUID to prevent path traversal and collisions."""
        _, ext = self.validate_file(file)
        max_bytes = (max_size_mb or settings.MAX_UPLOAD_SIZE_MB) * 1024 * 1024
        
        if hasattr(file, "file") and hasattr(file.file, "read"):
            content = file.file.read()
        else:
            content = await file.read()
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds maximum allowed size of {max_size_mb or settings.MAX_UPLOAD_SIZE_MB}MB."
            )

        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(self.upload_dir, filename)

        # Ensure filepath stays inside upload_dir
        if not os.path.abspath(filepath).startswith(self.upload_dir):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Illegal file storage path attempt."
            )

        with open(filepath, "wb") as f:
            f.write(content)

        relative_url = f"/uploads/{filename}"
        return filepath, relative_url, content

    def extract_frames(self, filepath: str, ext: str) -> List[bytes]:
        """Extract key video frames or return single image bytes."""
        if ext in ["jpg", "jpeg", "png", "webp"]:
            with open(filepath, "rb") as f:
                return [f.read()]

        frames = []
        try:
            import cv2
            cap = cv2.VideoCapture(filepath)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 30
            # Sample up to 3 frames spaced evenly
            sample_points = [0, total_frames // 2, max(0, total_frames - 2)]
            for pt in sample_points:
                cap.set(cv2.CAP_PROP_POS_FRAMES, pt)
                ret, frame = cap.read()
                if ret:
                    # Convert to JPEG bytes
                    _, buffer = cv2.imencode(".jpg", frame)
                    frames.append(buffer.tobytes())
            cap.release()
        except Exception as e:
            logger.warning(f"OpenCV frame extraction unavailable or failed ({e}). Using raw file as fallback.")
            with open(filepath, "rb") as f:
                frames.append(f.read())

        return frames if frames else [open(filepath, "rb").read()]


storage_service = StorageService()
