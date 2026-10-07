import os
import uuid
import httpx
from typing import Tuple
from app.config import settings

class StorageService:
    def __init__(self):
        self.supabase_url = settings.SUPABASE_URL.strip().rstrip("/") if settings.SUPABASE_URL else ""
        self.service_key = settings.SUPABASE_SERVICE_ROLE_KEY.strip() if settings.SUPABASE_SERVICE_ROLE_KEY else ""
        self.bucket = settings.SUPABASE_STORAGE_BUCKET
        self.upload_dir = settings.UPLOAD_DIR

        # Ensure local upload dir exists
        os.makedirs(self.upload_dir, exist_ok=True)

    async def upload_image(
        self,
        file_bytes: bytes,
        filename: str = "image.jpg",
        content_type: str = "image/jpeg",
        report_code: str = "DWN-GEN"
    ) -> Tuple[str, str]:
        """
        Upload image to Supabase Storage.
        Falls back to local file storage if Supabase credentials are not configured.
        Returns: (public_image_url, storage_path)
        """
        ext = filename.split(".")[-1].lower() if "." in filename else "jpg"
        unique_name = f"{uuid.uuid4().hex[:8]}_{report_code}.{ext}"
        storage_path = f"reports/{report_code}/{unique_name}"

        # 1. Try Supabase Storage if configured
        if self.supabase_url and self.service_key:
            try:
                url = f"{self.supabase_url}/storage/v1/object/{self.bucket}/{storage_path}"
                headers = {
                    "Authorization": f"Bearer {self.service_key}",
                    "Content-Type": content_type or "image/jpeg",
                    "x-upsert": "true",
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.post(url, headers=headers, content=file_bytes)
                    if response.status_code in [200, 201]:
                        public_url = f"{self.supabase_url}/storage/v1/object/public/{self.bucket}/{storage_path}"
                        return public_url, storage_path
            except Exception as e:
                print(f"[StorageService] Supabase upload failed, using local storage fallback: {e}")

        # 2. Local File Storage Fallback
        local_filename = f"{report_code}_{unique_name}"
        local_path = os.path.join(self.upload_dir, local_filename)
        with open(local_path, "wb") as f:
            f.write(file_bytes)

        # Serve via backend endpoint
        public_url = f"http://localhost:8000/uploads/{local_filename}"
        return public_url, storage_path

    async def delete_image(self, storage_path: str) -> bool:
        """Delete image from storage."""
        if self.supabase_url and self.service_key:
            try:
                url = f"{self.supabase_url}/storage/v1/object/{self.bucket}/{storage_path}"
                headers = {"Authorization": f"Bearer {self.service_key}"}
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.delete(url, headers=headers)
                    return resp.status_code in [200, 204]
            except Exception:
                pass
        return True

storage_service = StorageService()
