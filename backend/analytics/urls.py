from django.urls import path

from .views import AnalyticsReportView, ForecastView, InsightsView

urlpatterns = [
    path("report/", AnalyticsReportView.as_view(), name="analytics-report"),
    path("insights/", InsightsView.as_view(), name="analytics-insights"),
    path("forecast/", ForecastView.as_view(), name="analytics-forecast"),
]
