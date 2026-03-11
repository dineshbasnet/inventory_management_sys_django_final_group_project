from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from core.permissions.roles import IsManagerOrAdmin, IsAnyStaff


class CategoryViewSet(viewsets.ModelViewSet):

    queryset         = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManagerOrAdmin()]
        return [IsAnyStaff()]


class ProductViewSet(viewsets.ModelViewSet):
  
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    filter_backends  = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields    = ['name', 'sku', 'description']
    ordering_fields  = ['name', 'selling_price', 'created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManagerOrAdmin()]
        return [IsAnyStaff()]

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Return all products where stock is below minimum_stock."""
        from django.db.models import F
        products = Product.objects.filter(
            is_active=True,
            stock__quantity__lt=F('minimum_stock')
        ).select_related('category', 'stock')
        return Response(ProductSerializer(products, many=True).data)