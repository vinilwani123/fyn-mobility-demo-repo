from apps.transactions.models import ServiceTransaction
from django.db.models import Sum
from django.db.models.functions import TruncDay, TruncMonth, TruncYear
import logging

logger = logging.getLogger('vsm')

class RevenueQueries:
    @staticmethod
    def get_daily_revenue():
        logger.info("Daily revenue generated")
        return list(
            ServiceTransaction.objects.filter(status='PAID', payment_date__isnull=False)
            .annotate(date=TruncDay('payment_date'))
            .values('date')
            .annotate(total=Sum('final_cost'))
            .order_by('date')
        )

    @staticmethod
    def get_monthly_revenue():
        logger.info("Monthly revenue generated")
        return list(
            ServiceTransaction.objects.filter(status='PAID', payment_date__isnull=False)
            .annotate(month=TruncMonth('payment_date'))
            .values('month')
            .annotate(total=Sum('final_cost'))
            .order_by('month')
        )

    @staticmethod
    def get_yearly_revenue():
        logger.info("Yearly revenue generated")
        return list(
            ServiceTransaction.objects.filter(status='PAID', payment_date__isnull=False)
            .annotate(year=TruncYear('payment_date'))
            .values('year')
            .annotate(total=Sum('final_cost'))
            .order_by('year')
        )
