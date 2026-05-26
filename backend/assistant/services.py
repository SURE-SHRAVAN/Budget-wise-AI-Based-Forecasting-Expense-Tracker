from django.conf import settings

from analytics.services import FinancialAnalyticsService

from .models import Conversation, Message
from .prompts import SYSTEM_PROMPT


class AssistantService:
    def __init__(self, user):
        self.user = user
        self.analytics = FinancialAnalyticsService(user)

    def get_or_create_conversation(self, conversation_id=None):
        if conversation_id:
            return Conversation.objects.get(id=conversation_id, user=self.user)
        return Conversation.objects.create(user=self.user)

    def answer(self, prompt, conversation):
        Message.objects.create(conversation=conversation, role=Message.Role.USER, content=prompt)
        if not settings.OPENAI_API_KEY:
            content = self._local_answer(prompt)
        else:
            content = self._openai_answer(prompt, conversation)

        message = Message.objects.create(
            conversation=conversation,
            role=Message.Role.ASSISTANT,
            content=content,
        )
        conversation.title = self._title_from_prompt(prompt)
        conversation.save(update_fields=["title", "updated_at"])
        return message

    def _openai_answer(self, prompt, conversation):
        from openai import OpenAI

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        history = list(conversation.messages.order_by("-created_at")[:8])[::-1]
        context = self.analytics.financial_context_text()
        input_messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "developer", "content": f"Financial context for this user: {context}"},
        ]
        input_messages.extend({"role": message.role, "content": message.content} for message in history)
        input_messages.append({"role": "user", "content": prompt})

        response = client.responses.create(
            model=settings.OPENAI_MODEL,
            input=input_messages,
            temperature=0.2,
        )
        return response.output_text

    def _local_answer(self, prompt):
        report = self.analytics.report()
        prompt_lower = prompt.lower()

        if "overspend" in prompt_lower or "overspending" in prompt_lower:
            top = report["category_breakdown"][0] if report["category_breakdown"] else None
            if top:
                return f"Your highest pressure area is {top['category']} at {top['value']:.0f}. Start by setting a weekly cap there and review recurring payments."
            return "I do not see enough expense data yet. Add a few transactions and I can detect overspending patterns."

        if "afford" in prompt_lower:
            balance = report["overview"]["balance"]
            savings_rate = report["overview"]["savings_rate"]
            return f"Your current balance is {balance:.0f} and your savings rate is {savings_rate}%. Keep the purchase below discretionary surplus after protecting goal contributions."

        if "food" in prompt_lower:
            food = next((item for item in report["category_breakdown"] if item["category"].lower() == "food"), None)
            amount = food["value"] if food else 0
            return f"You spent {amount:.0f} on food in the current tracked period."

        if "predict" in prompt_lower or "6 months" in prompt_lower:
            projection = report["forecasts"]["six_month_savings_projection"]
            return f"Based on your recent average cash flow, your projected savings over 6 months is {projection:.0f}."

        insights = report["insights"]
        if insights:
            return f"{insights[0]['title']} {insights[0]['detail']}"
        return "Add more transactions and goals so I can build a richer financial profile."

    def _title_from_prompt(self, prompt):
        title = prompt.strip()[:80]
        return title or "Financial planning chat"
