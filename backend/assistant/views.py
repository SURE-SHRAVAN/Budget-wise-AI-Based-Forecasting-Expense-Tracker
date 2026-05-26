from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Conversation
from .serializers import ChatRequestSerializer, ConversationSerializer, MessageSerializer
from .services import AssistantService


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).prefetch_related("messages")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def message(self, request, pk=None):
        conversation = self.get_object()
        serializer = ChatRequestSerializer(data={"message": request.data.get("message")})
        serializer.is_valid(raise_exception=True)
        message = AssistantService(request.user).answer(serializer.validated_data["message"], conversation)
        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)


class ChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = AssistantService(request.user)
        conversation = service.get_or_create_conversation(serializer.validated_data.get("conversation_id"))
        message = service.answer(serializer.validated_data["message"], conversation)
        return Response(
            {
                "conversation": ConversationSerializer(conversation).data,
                "message": MessageSerializer(message).data,
            },
            status=status.HTTP_201_CREATED,
        )
