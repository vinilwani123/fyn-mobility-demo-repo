import time
import logging

logger = logging.getLogger('vsm')

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = int((time.time() - start_time) * 1000)
        
        # We only log API requests to keep it clean
        if request.path.startswith('/api/'):
            log_msg = f"{request.method} {request.path} | Status={response.status_code} | Duration={duration}ms"
            
            # Use error logger if status code is an error
            if response.status_code >= 500:
                logger.error(log_msg)
            elif response.status_code >= 400:
                logger.warning(log_msg)
            else:
                logger.info(log_msg)

        return response
