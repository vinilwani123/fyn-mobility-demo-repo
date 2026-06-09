from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from core.services.transaction_service import TransactionService
from apps.transactions.serializers import ServiceTransactionSerializer
from apps.transactions.models import ServiceTransaction
from apps.vehicles.models import Vehicle
from decimal import Decimal

class ServiceTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceTransaction.objects.all()
    serializer_class = ServiceTransactionSerializer

    @action(detail=False, methods=['post'])
    def simulate_payment(self, request):
        vehicle_id = request.data.get('vehicle_id')
        labor_charges = Decimal(request.data.get('labor_charges', '0.00'))
        other_charges = Decimal(request.data.get('other_charges', '0.00'))
        
        try:
            vehicle = Vehicle.objects.get(id=vehicle_id)
        except Vehicle.DoesNotExist:
            return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)
            
        transaction = TransactionService.create_transaction(
            vehicle=vehicle,
            labor_charges=labor_charges,
            other_charges=other_charges
        )
        return Response(self.get_serializer(transaction).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        transaction = TransactionService.mark_paid(pk)
        return Response(self.get_serializer(transaction).data)

    @action(detail=True, methods=['get'])
    def receipt(self, request, pk=None):
        receipt_data = TransactionService.generate_receipt(pk)
        return Response(receipt_data)
