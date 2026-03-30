from fastapi.responses import JSONResponse
from fastapi import status


def success_response(data, message: str = "Success", status_code: int = 200):
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data
        }
    )


def error_response(message: str, status_code: int = 400, data=None):
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": data
        }
    )
