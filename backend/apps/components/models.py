from django.db import models
from core.models.base import BaseModel

class Component(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    repair_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
