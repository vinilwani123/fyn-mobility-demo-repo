from django.db import transaction
from django.utils import timezone
from apps.vehicles.models import Vehicle
from apps.transactions.models import ServiceTransaction, TransactionItem
from core.services.pricing_service import PricingService
from decimal import Decimal
import logging

logger = logging.getLogger('vsm')

class TransactionService:
    @staticmethod
    @transaction.atomic
    def create_transaction(vehicle: Vehicle, labor_charges: Decimal = Decimal('0.00'), other_charges: Decimal = Decimal('0.00')) -> ServiceTransaction:
        # Fetch open issues
        issues = vehicle.issues.filter(status='OPEN')
        
        service_transaction = ServiceTransaction.objects.create(
            vehicle=vehicle,
            labor_charges=labor_charges,
            other_charges=other_charges,
            status='PENDING'
        )

        total_amount = Decimal('0.00')

        for issue in issues:
            for issue_comp in issue.issue_components.all():
                comp_cost = PricingService.calculate_component_cost(issue_comp)
                rep_cost = PricingService.calculate_repair_cost(issue_comp)
                item_amount = comp_cost + rep_cost
                
                if item_amount > 0:
                    TransactionItem.objects.create(
                        transaction=service_transaction,
                        issue=issue,
                        component=issue_comp.component,
                        amount=item_amount,
                        quantity=issue_comp.quantity
                    )
                    total_amount += item_amount
            
            # Update issue status
            issue.status = 'IN_PROGRESS'
            issue.save()

        service_transaction.total_amount = total_amount
        service_transaction.final_cost = PricingService.calculate_final_amount(
            total_component_cost=total_amount, # Simplifying component vs repair split for total
            total_repair_cost=Decimal('0.00'),
            labor_charges=labor_charges,
            other_charges=other_charges
        )
        service_transaction.save()
        logger.info(f"Payment simulated | transaction_id={service_transaction.id} | final_cost={service_transaction.final_cost}")
        return service_transaction

    @staticmethod
    @transaction.atomic
    def mark_paid(transaction_id) -> ServiceTransaction:
        service_transaction = ServiceTransaction.objects.get(id=transaction_id)
        if service_transaction.status == 'PAID':
            from core.exceptions.handler import BaseAppException
            raise BaseAppException(detail="Transaction already paid", status_code=400)
            
        service_transaction.status = 'PAID'
        service_transaction.payment_date = timezone.now()
        service_transaction.save()
        
        # Mark all related issues as resolved
        for item in service_transaction.items.all():
            if item.issue and item.issue.status != 'RESOLVED':
                item.issue.status = 'RESOLVED'
                item.issue.save()
                
        logger.info(f"Payment completed | transaction_id={transaction_id}")
        return service_transaction

    @staticmethod
    def generate_receipt(transaction_id) -> dict:
        txn = ServiceTransaction.objects.get(id=transaction_id)
        items = txn.items.all()
        return {
            "transaction_id": txn.id,
            "vehicle": txn.vehicle.license_plate,
            "total_amount": txn.total_amount,
            "labor_charges": txn.labor_charges,
            "other_charges": txn.other_charges,
            "final_cost": txn.final_cost,
            "status": txn.status,
            "payment_date": txn.payment_date,
            "items": [
                {
                    "issue": item.issue.description if item.issue else None,
                    "component": item.component.name if item.component else None,
                    "quantity": item.quantity,
                    "amount": item.amount
                }
                for item in items
            ]
        }
