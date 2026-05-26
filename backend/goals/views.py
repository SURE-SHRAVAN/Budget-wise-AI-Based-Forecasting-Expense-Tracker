from django.db import models
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Goal
from .serializers import GoalSerializer


class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering_fields = ["deadline", "target_amount", "current_amount", "created_at"]

    def get_queryset(self):
        queryset = Goal.objects.filter(user=self.request.user)
        search = self.request.query_params.get("search")
        ordering = self.request.query_params.get("ordering")

        if search:
            queryset = queryset.filter(name__icontains=search)
        if ordering:
            allowed = {"deadline", "-deadline", "target_amount", "-target_amount", "current_amount", "-current_amount"}
            if ordering in allowed:
                queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def analytics(self, request):
        goals = self.get_queryset()
        total_target = sum(goal.target_amount for goal in goals)
        total_saved = sum(goal.current_amount for goal in goals)
        progress = round((total_saved / total_target) * 100) if total_target else 0
        completed_goals = goals.filter(current_amount__gte=models.F("target_amount")).count()

        return Response(
            {
                "total_goals": goals.count(),
                "total_target": total_target,
                "total_saved": total_saved,
                "overall_progress": min(progress, 100),
                "completed_goals": completed_goals,
            }
        )
