from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from products.models import Product
from .models import Stock, StockMovement
from .serializers import (
    StockSerializer,
    StockMovementSerializer,
    StockAddRemoveSerializer,
    StockAdjustSerializer,
)
from .services import StockService
from core.permissions.roles import IsManagerOrAdmin, IsAnyStaff


class StockViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Stock.objects.select_related("product").all()
    serializer_class = StockSerializer
    permission_classes = [IsAnyStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["product"]

    @action(detail=False, methods=["post"])
    def add(self, request):
        serializer = StockAddRemoveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        product = Product.objects.get(pk=d["product"])
        stock = StockService.add_stock(
            product=product,
            quantity=d["quantity"],
            reference=d.get("reference", ""),
            notes=d.get("notes", ""),
            user=request.user,
        )
        return Response(StockSerializer(stock).data)

    @action(detail=False, methods=["post"])
    def remove(self, request):
        serializer = StockAddRemoveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        product = Product.objects.get(pk=d["product"])
        try:
            stock = StockService.remove_stock(
                product=product,
                quantity=d["quantity"],
                reference=d.get("reference", ""),
                notes=d.get("notes", ""),
                user=request.user,
            )
            return Response(StockSerializer(stock).data)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], permission_classes=[IsManagerOrAdmin])
    def adjust(self, request):
        serializer = StockAdjustSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        product = Product.objects.get(pk=d["product"])
        stock = StockService.adjust_stock(
            product=product,
            new_quantity=d["new_quantity"],
            notes=d.get("notes", ""),
            user=request.user,
        )
        return Response(StockSerializer(stock).data)


class StockMovementListView(generics.ListAPIView):

    queryset = StockMovement.objects.select_related("product", "performed_by").all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAnyStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["product", "movement_type"]
