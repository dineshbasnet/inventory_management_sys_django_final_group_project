from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import PurchaseOrder
from .serializers import PurchaseOrderSerializer
from core.permissions.roles import IsManagerOrAdmin, IsAnyStaff


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = (
        PurchaseOrder.objects.select_related("supplier", "created_by", "approved_by")
        .prefetch_related("items__product")
        .all()
    )
    serializer_class = PurchaseOrderSerializer

    def get_permissions(self):
        if self.action in [
            "create",
            "update",
            "partial_update",
            "approve",
            "receive",
            "destroy",
        ]:
            return [IsManagerOrAdmin()]
        return [IsAnyStaff()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        order = self.get_object()
        if order.status != "pending":
            return Response(
                {"error": "Only pending orders can be approved."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = "approved"
        order.approved_by = request.user
        order.approved_at = timezone.now()
        order.save()
        return Response(PurchaseOrderSerializer(order).data)

    @action(detail=True, methods=["post"])
    def receive(self, request, pk=None):
        order = self.get_object()
        if order.status != "approved":
            return Response(
                {"error": "Only approved orders can be received."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = "received"
        order.received_at = timezone.now()
        order.save()

        from stock.services import StockService

        for item in order.items.all():
            StockService.add_stock(
                product=item.product,
                quantity=item.quantity,
                reference=order.order_number,
                notes=f"Received from PO {order.order_number}",
                user=request.user,
            )

        return Response(PurchaseOrderSerializer(order).data)
