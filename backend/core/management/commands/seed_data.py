from django.core.management.base import BaseCommand
from apps.components.models import Component
from apps.vehicles.models import Vehicle
from apps.issues.models import VehicleIssue
from core.services.issue_service import IssueService
from core.services.transaction_service import TransactionService
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seed database with initial data for testing and demo purposes'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Seed Components
        components_data = [
            {"name": "Brake Pads", "description": "High performance brake pads", "purchase_price": 50.00, "repair_price": 20.00},
            {"name": "Oil Filter", "description": "Standard oil filter", "purchase_price": 15.00, "repair_price": 5.00},
            {"name": "Spark Plug", "description": "Iridium spark plug", "purchase_price": 12.00, "repair_price": 0.00},
            {"name": "Alternator", "description": "12V 100A Alternator", "purchase_price": 120.00, "repair_price": 80.00},
            {"name": "Battery", "description": "12V Car Battery", "purchase_price": 100.00, "repair_price": 0.00},
        ]
        
        components = []
        for c in components_data:
            comp, created = Component.objects.get_or_create(name=c["name"], defaults=c)
            components.append(comp)

        # Seed Vehicles
        vehicles_data = [
            {"license_plate": "ABC-1234", "vin": "VIN1234567890ABC1", "make": "Toyota", "model": "Camry", "year": 2018, "owner_name": "John Doe"},
            {"license_plate": "XYZ-9876", "vin": "VIN1234567890XYZ2", "make": "Honda", "model": "Civic", "year": 2020, "owner_name": "Jane Smith"},
            {"license_plate": "LMN-4567", "vin": "VIN1234567890LMN3", "make": "Ford", "model": "Mustang", "year": 2015, "owner_name": "Alice Brown"},
            {"license_plate": "QRS-3210", "vin": "VIN1234567890QRS4", "make": "Chevrolet", "model": "Malibu", "year": 2019, "owner_name": "Bob White"},
            {"license_plate": "DEF-5678", "vin": "VIN1234567890DEF5", "make": "Nissan", "model": "Altima", "year": 2021, "owner_name": "Charlie Green"},
        ]
        
        vehicles = []
        for v in vehicles_data:
            veh, created = Vehicle.objects.get_or_create(license_plate=v["license_plate"], defaults=v)
            vehicles.append(veh)

        # Seed Issues and Transactions for a few vehicles
        if not VehicleIssue.objects.exists():
            # Vehicle 1: Brake replacement
            issue1 = IssueService.report_issue(vehicles[0], "Brakes squeaking loudly")
            IssueService.assign_component(issue1, components[0], "REPLACE", 4)
            txn1 = TransactionService.create_transaction(vehicles[0], Decimal('50.00'), Decimal('10.00'))
            TransactionService.mark_paid(txn1.id)

            # Vehicle 2: Oil change & battery repair (replace)
            issue2 = IssueService.report_issue(vehicles[1], "Needs oil change and car won't start")
            IssueService.assign_component(issue2, components[1], "REPLACE", 1)
            IssueService.assign_component(issue2, components[4], "REPLACE", 1)
            txn2 = TransactionService.create_transaction(vehicles[1], Decimal('80.00'), Decimal('5.00'))
            TransactionService.mark_paid(txn2.id)

            # Vehicle 3: Alternator repair
            issue3 = IssueService.report_issue(vehicles[2], "Battery not charging, suspected alternator")
            IssueService.assign_component(issue3, components[3], "REPAIR", 1)
            txn3 = TransactionService.create_transaction(vehicles[2], Decimal('120.00'), Decimal('0.00'))
            TransactionService.mark_paid(txn3.id)

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database.'))
