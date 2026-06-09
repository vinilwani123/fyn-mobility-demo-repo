from apps.components.models import Component
import logging

logger = logging.getLogger('vsm')

class ComponentService:
    @staticmethod
    def create_component(data: dict) -> Component:
        component = Component.objects.create(**data)
        logger.info(f"Component created | component_id={component.id} | name={component.name}")
        return component

    @staticmethod
    def get_component(component_id) -> Component:
        return Component.objects.get(id=component_id)

    @staticmethod
    def update_component(component_id, data: dict) -> Component:
        Component.objects.filter(id=component_id).update(**data)
        logger.info(f"Component updated | component_id={component_id}")
        return Component.objects.get(id=component_id)

    @staticmethod
    def delete_component(component_id) -> None:
        component = Component.objects.get(id=component_id)
        component.is_deleted = True
        component.save()
        logger.info(f"Component deleted | component_id={component_id}")

