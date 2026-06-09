from rest_framework import serializers
from apps.transactions.models import ServiceTransaction, TransactionItem

class TransactionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionItem
        fields = ['id', 'issue', 'component', 'amount', 'quantity']

class ServiceTransactionSerializer(serializers.ModelSerializer):
    items = TransactionItemSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceTransaction
        fields = ['id', 'vehicle', 'total_amount', 'labor_charges', 'other_charges', 'final_cost', 'status', 'payment_date', 'items', 'created_at']
