from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ChatView, ConversationViewSet

router = DefaultRouter()
router.register("conversations", ConversationViewSet, basename="conversations")

urlpatterns = [
    path("chat/", ChatView.as_view(), name="assistant-chat"),
    path("", include(router.urls)),
]
