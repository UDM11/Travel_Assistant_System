import logging
from datetime import datetime
from typing import Any

class Logger:
    def __init__(self, name: str = "travel_assist"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
    
    def info(self, message: str, **kwargs: Any) -> None:
        self.logger.info(f"{message} {kwargs if kwargs else ''}")
    
    def error(self, message: str, **kwargs: Any) -> None:
        self.logger.error(f"{message} {kwargs if kwargs else ''}")
    
    def warning(self, message: str, **kwargs: Any) -> None:
        self.logger.warning(f"{message} {kwargs if kwargs else ''}")
    
    def debug(self, message: str, **kwargs: Any) -> None:
        self.logger.debug(f"{message} {kwargs if kwargs else ''}")