from apps.issues.models import VehicleIssue, IssueComponent
from apps.vehicles.models import Vehicle
from apps.components.models import Component
from django.db import transaction
import logging

logger = logging.getLogger('vsm')

class IssueService:
    @staticmethod
    def report_issue(vehicle: Vehicle, description: str) -> VehicleIssue:
        issue = VehicleIssue.objects.create(
            vehicle=vehicle,
            description=description,
            status='OPEN'
        )
        logger.info(f"Issue created | issue_id={issue.id} | vehicle_id={vehicle.id}")
        return issue

    @staticmethod
    @transaction.atomic
    def assign_component(issue: VehicleIssue, component: Component, action: str, quantity: int = 1) -> IssueComponent:
        # Business logic: validate action
        if action not in ['REPAIR', 'REPLACE']:
            raise ValueError("Action must be REPAIR or REPLACE")

        # Snapshot the price
        applied_price = component.repair_price if action == 'REPAIR' else component.purchase_price

        issue_comp = IssueComponent.objects.create(
            issue=issue,
            component=component,
            action=action,
            quantity=quantity,
            applied_price=applied_price
        )
        logger.info(f"Component assigned | issue_id={issue.id} | component_id={component.id} | action={action}")
        return issue_comp
