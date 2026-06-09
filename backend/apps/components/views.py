from rest_framework import viewsets, status
from rest_framework.response import Response
from core.services.component_service import ComponentService
from apps.components.serializers import ComponentSerializer
from apps.components.models import Component

class ComponentViewSet(viewsets.ModelViewSet):
    queryset = Component.objects.filter(is_deleted=False)
    serializer_class = ComponentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        component = ComponentService.create_component(serializer.validated_data)
        response_serializer = self.get_serializer(component)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        component = ComponentService.update_component(instance.id, serializer.validated_data)
        return Response(self.get_serializer(component).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        ComponentService.delete_component(instance.id)
        return Response(status=status.HTTP_204_NO_CONTENT)
