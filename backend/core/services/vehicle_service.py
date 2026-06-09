from apps.vehicles.models import Vehicle
import logging

logger = logging.getLogger('vsm')

class VehicleService:
    @staticmethod
    def register_vehicle(data: dict) -> Vehicle:
        vehicle = Vehicle.objects.create(**data)
        logger.info(f"Vehicle registered | vehicle_id={vehicle.id} | license_plate={vehicle.license_plate}")
        return vehicle

    @staticmethod
    def get_vehicle(vehicle_id) -> Vehicle:
        return Vehicle.objects.get(id=vehicle_id)

    @staticmethod
    def update_vehicle(vehicle_id, data: dict) -> Vehicle:
        Vehicle.objects.filter(id=vehicle_id).update(**data)
        return Vehicle.objects.get(id=vehicle_id)

    @staticmethod
    def delete_vehicle(vehicle_id) -> None:
        vehicle = Vehicle.objects.get(id=vehicle_id)
        vehicle.is_deleted = True
        vehicle.save()

