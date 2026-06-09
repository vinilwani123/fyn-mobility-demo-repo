from django.db import models
from core.models.base import BaseModel
from apps.vehicles.models import Vehicle
from apps.components.models import Component

class VehicleIssue(BaseModel):
    STATUS_CHOICES = (
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
    )
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='issues')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')

    def __str__(self):
        return f"{self.vehicle.license_plate} - {self.status}"

class IssueComponent(BaseModel):
    ACTION_CHOICES = (
        ('REPAIR', 'Repair'),
        ('REPLACE', 'Replace'),
    )
    issue = models.ForeignKey(VehicleIssue, on_delete=models.CASCADE, related_name='issue_components')
    component = models.ForeignKey(Component, on_delete=models.PROTECT)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    quantity = models.PositiveIntegerField(default=1)
    applied_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Snapshot of the price applied at selection")

    def __str__(self):
        return f"{self.action} {self.component.name} (x{self.quantity})"
