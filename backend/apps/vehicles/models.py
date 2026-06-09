from django.db import models
from core.models.base import BaseModel

class Vehicle(BaseModel):
    license_plate = models.CharField(max_length=20, unique=True)
    vin = models.CharField(max_length=50, unique=True)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    owner_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.license_plate} - {self.make} {self.model}"
