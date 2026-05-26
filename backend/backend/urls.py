from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from core.views import HealthCheckView

api_v1_patterns = [
    path("auth/", include("accounts.urls")),
    path("transactions/", include("transactions.urls")),
    path("goals/", include("goals.urls")),
    path("analytics/", include("analytics.urls")),
    path("assistant/", include("assistant.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", HealthCheckView.as_view(), name="health-check"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/v1/", include(api_v1_patterns)),
    # Backward-compatible aliases for the earlier frontend during migration.
    path("api/auth/", include("accounts.urls")),
    path("api/transactions/", include("transactions.urls")),
    path("api/goals/", include("goals.urls")),
]
