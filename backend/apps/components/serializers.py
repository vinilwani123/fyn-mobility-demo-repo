from rest_framework import serializers
from apps.components.models import Component

class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = ['id', 'name', 'description', 'purchase_price', 'repair_price', 'created_at']
