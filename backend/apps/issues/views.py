from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from core.services.issue_service import IssueService
from core.services.vehicle_service import VehicleService
from core.services.component_service import ComponentService
from apps.issues.serializers import VehicleIssueSerializer, IssueComponentSerializer
from apps.issues.models import VehicleIssue

class VehicleIssueViewSet(viewsets.ModelViewSet):
    queryset = VehicleIssue.objects.all()
    serializer_class = VehicleIssueSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vehicle = serializer.validated_data['vehicle']
        issue = IssueService.report_issue(
            vehicle=vehicle,
            description=serializer.validated_data['description']
        )
        response_serializer = self.get_serializer(issue)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def assign_component(self, request, pk=None):
        issue = self.get_object()
        serializer = IssueComponentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        component = serializer.validated_data['component']
        action_type = serializer.validated_data['action']
        quantity = serializer.validated_data.get('quantity', 1)
        
        issue_comp = IssueService.assign_component(
            issue=issue,
            component=component,
            action=action_type,
            quantity=quantity
        )
        
        return Response(IssueComponentSerializer(issue_comp).data, status=status.HTTP_201_CREATED)
