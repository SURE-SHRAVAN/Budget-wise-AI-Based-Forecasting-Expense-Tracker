from datetime import timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone

from accounts.models import User
from goals.models import Goal
from transactions.models import Transaction


class Command(BaseCommand):
    help = "Seed a demo fintech workspace with realistic user-owned finance data."

    def handle(self, *args, **options):
        user, _ = User.objects.get_or_create(
            email="demo@budgetwise.ai",
            defaults={"username": "demo", "first_name": "Aarav", "currency": "INR"},
        )
        user.set_password("DemoPass123!")
        user.save()

        Transaction.objects.filter(user=user).delete()
        Goal.objects.filter(user=user).delete()

        today = timezone.now().date()
        transactions = [
            ("Salary", "Salary", Transaction.Type.INCOME, Decimal("145000"), today.replace(day=1)),
            ("Freelance design sprint", "Freelance", Transaction.Type.INCOME, Decimal("22000"), today - timedelta(days=9)),
            ("Apartment rent", "Housing", Transaction.Type.EXPENSE, Decimal("38000"), today - timedelta(days=18)),
            ("Groceries and staples", "Food", Transaction.Type.EXPENSE, Decimal("12800"), today - timedelta(days=5)),
            ("Metro and rides", "Transport", Transaction.Type.EXPENSE, Decimal("5100"), today - timedelta(days=3)),
            ("Streaming and movies", "Entertainment", Transaction.Type.EXPENSE, Decimal("4200"), today - timedelta(days=11)),
            ("Cloud tools", "Software", Transaction.Type.EXPENSE, Decimal("3100"), today - timedelta(days=14)),
            ("Health insurance", "Health", Transaction.Type.EXPENSE, Decimal("6500"), today - timedelta(days=22)),
        ]

        for description, category, txn_type, amount, date in transactions:
            Transaction.objects.create(
                user=user,
                description=description,
                category=category,
                type=txn_type,
                amount=amount,
                date=date,
            )

        Goal.objects.bulk_create(
            [
                Goal(
                    user=user,
                    name="Emergency fund",
                    target_amount=Decimal("300000"),
                    current_amount=Decimal("118000"),
                    deadline=today + timedelta(days=210),
                ),
                Goal(
                    user=user,
                    name="AI workstation",
                    target_amount=Decimal("180000"),
                    current_amount=Decimal("54000"),
                    deadline=today + timedelta(days=150),
                ),
                Goal(
                    user=user,
                    name="Japan trip",
                    target_amount=Decimal("250000"),
                    current_amount=Decimal("76000"),
                    deadline=today + timedelta(days=330),
                ),
            ]
        )

        self.stdout.write(self.style.SUCCESS("Seeded demo@budgetwise.ai / DemoPass123!"))
