from apps.vehicles.models import Vehicle
from apps.components.models import Component
from apps.issues.models import VehicleIssue
from apps.transactions.models import ServiceTransaction
from django.db.models import Sum

class DashboardQueries:
    @staticmethod
    def get_summary():
        total_vehicles = Vehicle.objects.filter(is_deleted=False).count()
        total_components = Component.objects.filter(is_deleted=False).count()
        open_issues = VehicleIssue.objects.filter(status='OPEN', is_deleted=False).count()
        
        # Calculate total revenue from PAID transactions
        revenue_aggr = ServiceTransaction.objects.filter(status='PAID', is_deleted=False).aggregate(total=Sum('final_cost'))
        total_revenue = revenue_aggr['total'] or 0

        return {
            "total_vehicles": total_vehicles,
            "total_components": total_components,
            "open_issues": open_issues,
            "total_revenue": total_revenue
        }
