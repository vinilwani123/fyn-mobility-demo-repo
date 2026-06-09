from django.db import models
from core.models.base import BaseModel
from apps.vehicles.models import Vehicle
from apps.issues.models import VehicleIssue
from apps.components.models import Component

class ServiceTransaction(BaseModel):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
    )
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name='transactions')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    labor_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    other_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Transaction {self.id} - {self.status}"

class TransactionItem(BaseModel):
    transaction = models.ForeignKey(ServiceTransaction, on_delete=models.CASCADE, related_name='items')
    issue = models.ForeignKey(VehicleIssue, on_delete=models.SET_NULL, null=True, blank=True)
    component = models.ForeignKey(Component, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"Item for Tx {self.transaction.id} - {self.amount}"
