from django.urls import path
from .views import DashboardView, StockReportView, MovementReportView

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("stock/", StockReportView.as_view(), name="stock-report"),
    path("movements/", MovementReportView.as_view(), name="movement-report"),
]
