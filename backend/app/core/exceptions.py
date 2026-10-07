from fastapi import HTTPException, status

class DoonCleanException(HTTPException):
    def __init__(self, status_code: int, message: str, code: str = "ERROR"):
        super().__init__(
            status_code=status_code,
            detail={"code": code, "message": message}
        )

class EntityNotFoundException(DoonCleanException):
    def __init__(self, entity: str, identifier: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            message=f"{entity} with id '{identifier}' not found",
            code="NOT_FOUND"
        )

class UnauthorizedException(DoonCleanException):
    def __init__(self, message: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=message,
            code="UNAUTHORIZED"
        )

class ForbiddenException(DoonCleanException):
    def __init__(self, message: str = "You do not have permission to perform this action"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            message=message,
            code="FORBIDDEN"
        )

class ValidationException(DoonCleanException):
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=message,
            code="VALIDATION_ERROR"
        )
