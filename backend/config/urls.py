from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.components.views import ComponentViewSet
from apps.vehicles.views import VehicleViewSet
from apps.issues.views import VehicleIssueViewSet
from apps.transactions.views import ServiceTransactionViewSet
from apps.revenue.views import RevenueViewSet, DashboardViewSet

router = DefaultRouter()
router.register(r'components', ComponentViewSet, basename='component')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'issues', VehicleIssueViewSet, basename='issue')
router.register(r'transactions', ServiceTransactionViewSet, basename='transaction')
router.register(r'revenue', RevenueViewSet, basename='revenue')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
]

