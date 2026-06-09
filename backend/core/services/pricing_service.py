from decimal import Decimal
from apps.issues.models import IssueComponent
import logging

logger = logging.getLogger('vsm')

class PricingService:
    @staticmethod
    def calculate_component_cost(issue_component: IssueComponent) -> Decimal:
        if issue_component.action == 'REPLACE':
            return issue_component.component.purchase_price * issue_component.quantity
        return Decimal('0.00')

    @staticmethod
    def calculate_repair_cost(issue_component: IssueComponent) -> Decimal:
        if issue_component.action == 'REPAIR':
            return issue_component.component.repair_price * issue_component.quantity
        return Decimal('0.00')

    @staticmethod
    def calculate_final_amount(total_component_cost: Decimal, total_repair_cost: Decimal, labor_charges: Decimal, other_charges: Decimal) -> Decimal:
        final_cost = total_component_cost + total_repair_cost + labor_charges + other_charges
        logger.info(f"Final pricing calculated | final_cost={final_cost} | components={total_component_cost} | repairs={total_repair_cost}")
        return final_cost
