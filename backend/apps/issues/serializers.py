from rest_framework import serializers
from apps.issues.models import VehicleIssue, IssueComponent

class IssueComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueComponent
        fields = ['id', 'component', 'action', 'quantity', 'applied_price']
        read_only_fields = ['applied_price']

class VehicleIssueSerializer(serializers.ModelSerializer):
    issue_components = IssueComponentSerializer(many=True, read_only=True)

    class Meta:
        model = VehicleIssue
        fields = ['id', 'vehicle', 'description', 'status', 'issue_components', 'created_at']
