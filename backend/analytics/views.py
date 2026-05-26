from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import FinancialAnalyticsService


class AnalyticsReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cache_key = f"analytics:report:{request.user.id}"
        report = cache.get(cache_key)
        if not report:
            report = FinancialAnalyticsService(request.user).report()
            cache.set(cache_key, report, timeout=60)
        return Response(report)


class InsightsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"insights": FinancialAnalyticsService(request.user).insights()})


class ForecastView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(FinancialAnalyticsService(request.user).forecasts())
