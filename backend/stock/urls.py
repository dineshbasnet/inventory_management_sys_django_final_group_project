from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StockViewSet, StockMovementListView

router = DefaultRouter()
router.register('', StockViewSet, basename='stock')

urlpatterns = [
    path('movements/', StockMovementListView.as_view(), name='stock-movements'),
    path('', include(router.urls)),
]