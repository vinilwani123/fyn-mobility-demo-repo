from rest_framework import viewsets, status
from rest_framework.response import Response
from core.services.vehicle_service import VehicleService
from apps.vehicles.serializers import VehicleSerializer
from apps.vehicles.models import Vehicle

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.filter(is_deleted=False)
    serializer_class = VehicleSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vehicle = VehicleService.register_vehicle(serializer.validated_data)
        response_serializer = self.get_serializer(vehicle)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        vehicle = VehicleService.update_vehicle(instance.id, serializer.validated_data)
        return Response(self.get_serializer(vehicle).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        VehicleService.delete_vehicle(instance.id)
        return Response(status=status.HTTP_204_NO_CONTENT)
