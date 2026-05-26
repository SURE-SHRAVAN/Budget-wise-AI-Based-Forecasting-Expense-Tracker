import csv

from django.db.models import Q, Sum
from django.http import HttpResponse
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Transaction
from .serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ["description", "category"]
    ordering_fields = ["amount", "date", "created_at", "category", "type"]

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        transaction_type = self.request.query_params.get("type")
        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search")
        date_from = self.request.query_params.get("date_from")
        date_to = self.request.query_params.get("date_to")
        ordering = self.request.query_params.get("ordering")

        if transaction_type in {Transaction.Type.INCOME, Transaction.Type.EXPENSE}:
            queryset = queryset.filter(type=transaction_type)
        if category:
            queryset = queryset.filter(category__iexact=category)
        if search:
            queryset = queryset.filter(Q(description__icontains=search) | Q(category__icontains=search))
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        if ordering:
            allowed = {"amount", "-amount", "date", "-date", "created_at", "-created_at", "category", "-category"}
            if ordering in allowed:
                queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        queryset = self.get_queryset()
        income = queryset.filter(type=Transaction.Type.INCOME).aggregate(total=Sum("amount"))["total"] or 0
        expenses = queryset.filter(type=Transaction.Type.EXPENSE).aggregate(total=Sum("amount"))["total"] or 0
        return Response(
            {
                "income": income,
                "expenses": expenses,
                "balance": income - expenses,
                "count": queryset.count(),
            }
        )

    @action(detail=False, methods=["get"], url_path="export-csv")
    def export_csv(self, request):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="transactions.csv"'
        writer = csv.writer(response)
        writer.writerow(["date", "description", "category", "type", "amount"])

        for transaction in self.get_queryset():
            writer.writerow([
                transaction.date,
                transaction.description,
                transaction.category,
                transaction.type,
                transaction.amount,
            ])

        return response
