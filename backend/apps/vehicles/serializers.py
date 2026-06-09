from rest_framework import serializers
from apps.vehicles.models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'license_plate', 'vin', 'make', 'model', 'year', 'owner_name', 'created_at']
