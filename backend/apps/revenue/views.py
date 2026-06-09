from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.revenue.queries.revenue_queries import RevenueQueries
from apps.revenue.queries.dashboard_queries import DashboardQueries

class RevenueViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def daily(self, request):
        data = RevenueQueries.get_daily_revenue()
        return Response(data)

    @action(detail=False, methods=['get'])
    def monthly(self, request):
        data = RevenueQueries.get_monthly_revenue()
        return Response(data)

    @action(detail=False, methods=['get'])
    def yearly(self, request):
        data = RevenueQueries.get_yearly_revenue()
        return Response(data)

class DashboardViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def summary(self, request):
        data = DashboardQueries.get_summary()
        return Response(data)

