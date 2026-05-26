from collections import defaultdict
from datetime import date
from decimal import Decimal

from django.db.models import Avg, Sum
from django.utils import timezone

from goals.models import Goal
from transactions.models import Transaction


def money(value):
    return float(value or 0)


class FinancialAnalyticsService:
    def __init__(self, user):
        self.user = user
        self.transactions = Transaction.objects.filter(user=user)
        self.goals = Goal.objects.filter(user=user)

    def overview(self):
        income = self._total(Transaction.Type.INCOME)
        expenses = self._total(Transaction.Type.EXPENSE)
        balance = income - expenses
        savings_rate = round((balance / income) * 100, 1) if income else 0
        goal_target = sum(goal.target_amount for goal in self.goals)
        goal_saved = sum(goal.current_amount for goal in self.goals)
        goal_progress = round((goal_saved / goal_target) * 100, 1) if goal_target else 0

        return {
            "income": money(income),
            "expenses": money(expenses),
            "balance": money(balance),
            "savings_rate": savings_rate,
            "goal_progress": min(goal_progress, 100),
            "financial_health_score": self.financial_health_score(income, expenses, goal_progress),
            "transaction_count": self.transactions.count(),
            "goal_count": self.goals.count(),
        }

    def monthly_trends(self, months=6):
        today = timezone.now().date()
        buckets = []
        for offset in reversed(range(months)):
            month = today.month - offset
            year = today.year
            while month <= 0:
                month += 12
                year -= 1
            buckets.append((year, month))

        rows = []
        for year, month in buckets:
            month_transactions = self.transactions.filter(date__year=year, date__month=month)
            income = month_transactions.filter(type=Transaction.Type.INCOME).aggregate(total=Sum("amount"))["total"] or Decimal("0")
            expenses = month_transactions.filter(type=Transaction.Type.EXPENSE).aggregate(total=Sum("amount"))["total"] or Decimal("0")
            rows.append(
                {
                    "month": date(year, month, 1).strftime("%b"),
                    "income": money(income),
                    "expenses": money(expenses),
                    "savings": money(income - expenses),
                }
            )
        return rows

    def category_breakdown(self):
        grouped = (
            self.transactions.filter(type=Transaction.Type.EXPENSE)
            .values("category")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )
        return [{"category": item["category"], "value": money(item["total"])} for item in grouped]

    def expense_heatmap(self):
        heatmap = defaultdict(float)
        for transaction in self.transactions.filter(type=Transaction.Type.EXPENSE):
            heatmap[transaction.date.strftime("%a")] += money(transaction.amount)
        return [{"day": day, "value": round(heatmap[day], 2)} for day in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]]

    def insights(self):
        overview = self.overview()
        categories = self.category_breakdown()
        trends = self.monthly_trends(2)
        insights = []

        if categories:
            top = categories[0]
            insights.append(
                {
                    "type": "category",
                    "severity": "info",
                    "title": f"{top['category']} is your highest expense category.",
                    "detail": f"You spent {top['value']:.0f} in {top['category']}. Review recurring costs there first.",
                }
            )

        if len(trends) == 2:
            previous = trends[0]["expenses"]
            current = trends[1]["expenses"]
            if previous > 0:
                change = round(((current - previous) / previous) * 100)
                direction = "more" if change > 0 else "less"
                insights.append(
                    {
                        "type": "trend",
                        "severity": "warning" if change > 20 else "success",
                        "title": f"You spent {abs(change)}% {direction} than last month.",
                        "detail": "This is based on transaction totals for the current and previous month.",
                    }
                )

        if overview["savings_rate"] >= 20:
            insights.append(
                {
                    "type": "savings",
                    "severity": "success",
                    "title": f"Your savings rate is {overview['savings_rate']}%.",
                    "detail": "That is a strong rate for long-term goal funding.",
                }
            )
        elif overview["savings_rate"] < 0:
            insights.append(
                {
                    "type": "overspending",
                    "severity": "danger",
                    "title": "You are spending more than you earn.",
                    "detail": "Reduce flexible categories or add income before committing to new goals.",
                }
            )

        for goal in self.goals:
            months = self.goal_completion_months(goal)
            if months is not None:
                insights.append(
                    {
                        "type": "goal",
                        "severity": "info",
                        "title": f"You may reach your {goal.name} goal in {months} months.",
                        "detail": "Projection uses your current average monthly savings pace.",
                    }
                )

        return insights[:8]

    def forecasts(self):
        trends = self.monthly_trends(6)
        avg_income = sum(row["income"] for row in trends) / len(trends) if trends else 0
        avg_expenses = sum(row["expenses"] for row in trends) / len(trends) if trends else 0
        monthly_savings = avg_income - avg_expenses
        return {
            "average_income": round(avg_income, 2),
            "average_expenses": round(avg_expenses, 2),
            "monthly_savings_prediction": round(monthly_savings, 2),
            "six_month_savings_projection": round(monthly_savings * 6, 2),
            "anomalies": self.expense_anomalies(),
        }

    def report(self):
        return {
            "overview": self.overview(),
            "monthly_trends": self.monthly_trends(),
            "category_breakdown": self.category_breakdown(),
            "expense_heatmap": self.expense_heatmap(),
            "forecasts": self.forecasts(),
            "insights": self.insights(),
        }

    def financial_context_text(self):
        report = self.report()
        top_category = report["category_breakdown"][0]["category"] if report["category_breakdown"] else "None"
        return (
            f"Income: {report['overview']['income']}. Expenses: {report['overview']['expenses']}. "
            f"Balance: {report['overview']['balance']}. Savings rate: {report['overview']['savings_rate']}%. "
            f"Financial health score: {report['overview']['financial_health_score']}. "
            f"Top expense category: {top_category}. Goals: {report['overview']['goal_count']}."
        )

    def _total(self, transaction_type):
        return self.transactions.filter(type=transaction_type).aggregate(total=Sum("amount"))["total"] or Decimal("0")

    def financial_health_score(self, income=None, expenses=None, goal_progress=0):
        income = income if income is not None else self._total(Transaction.Type.INCOME)
        expenses = expenses if expenses is not None else self._total(Transaction.Type.EXPENSE)
        savings_rate = ((income - expenses) / income) * 100 if income else 0
        score = 50
        score += min(max(float(savings_rate), -30), 40)
        score += min(float(goal_progress) / 4, 20)
        score -= 10 if self.expense_anomalies() else 0
        return max(0, min(100, round(score)))

    def expense_anomalies(self):
        avg = self.transactions.filter(type=Transaction.Type.EXPENSE).aggregate(avg=Avg("amount"))["avg"]
        if not avg:
            return []
        threshold = avg * Decimal("1.75")
        return [
            {
                "id": transaction.id,
                "description": transaction.description,
                "amount": money(transaction.amount),
                "category": transaction.category,
                "date": transaction.date.isoformat(),
            }
            for transaction in self.transactions.filter(type=Transaction.Type.EXPENSE, amount__gt=threshold)[:6]
        ]

    def goal_completion_months(self, goal):
        trends = self.monthly_trends(6)
        avg_savings = sum(row["savings"] for row in trends) / len(trends) if trends else 0
        remaining = money(goal.target_amount - goal.current_amount)
        if avg_savings <= 0 or remaining <= 0:
            return None
        return max(1, round(remaining / avg_savings))
