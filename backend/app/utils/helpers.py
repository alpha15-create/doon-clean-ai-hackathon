import random
from typing import Any, Dict

def generate_report_code() -> str:
    """Generate human-readable report code such as DWN-1042."""
    num = random.randint(1001, 9999)
    return f"DWN-{num}"

def api_response(data: Any = None, message: str = "Success", success: bool = True) -> Dict[str, Any]:
    """Standard success API response matching frontend Axios wrapper."""
    return {
        "success": success,
        "data": data,
        "message": message
    }

def api_error_response(message: str = "An error occurred", code: str = "ERROR") -> Dict[str, Any]:
    """Standard error API response matching frontend Axios error format."""
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message
        }
    }
