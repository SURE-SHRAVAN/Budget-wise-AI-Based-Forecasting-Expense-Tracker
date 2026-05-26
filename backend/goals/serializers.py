from django.utils import timezone
from rest_framework import serializers

from .models import Goal


class GoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = [
            "id",
            "user",
            "name",
            "target_amount",
            "current_amount",
            "deadline",
            "progress_percentage",
            "remaining_amount",
            "days_remaining",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "progress_percentage",
            "remaining_amount",
            "days_remaining",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        target = attrs.get("target_amount", getattr(self.instance, "target_amount", None))
        current = attrs.get("current_amount", getattr(self.instance, "current_amount", 0))
        if target is not None and target <= 0:
            raise serializers.ValidationError({"target_amount": "Target amount must be greater than zero."})
        if current is not None and current < 0:
            raise serializers.ValidationError({"current_amount": "Current amount cannot be negative."})
        return attrs

    def get_progress_percentage(self, obj):
        return obj.progress_percentage

    def get_remaining_amount(self, obj):
        return max(obj.target_amount - obj.current_amount, 0)

    def get_days_remaining(self, obj):
        return (obj.deadline - timezone.now().date()).days
