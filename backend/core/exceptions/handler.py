from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger('vsm')

class BaseAppException(Exception):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "A server error occurred."

    def __init__(self, detail=None, status_code=None):
        self.detail = detail or self.default_detail
        if status_code is not None:
            self.status_code = status_code

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, BaseAppException):
        logger.error(f"Business exception: {exc.__class__.__name__} | {exc.detail}")
        return Response({
            "error": exc.__class__.__name__,
            "detail": exc.detail
        }, status=exc.status_code)

    if response is not None:
        if response.status_code >= 400 and response.status_code < 500:
            logger.warning(f"Validation exception | {response.data}")
        response.data['status_code'] = response.status_code

    return response
