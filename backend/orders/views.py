import uuid
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import PurchaseOrder
from .serializers import PurchaseOrderSerializer
from core.permissions.roles import IsManagerOrAdmin, IsAnyStaff


class PurchaseOrderViewSet(viewsets.ModelViewSet):

    queryset = PurchaseOrder.objects.select_related(
        'supplier', 'created_by'
    ).prefetch_related('items__product').all()
    serializer_class = PurchaseOrderSerializer
    filter_backends  = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['status', 'supplier']
    search_fields    = ['order_number', 'supplier__name']

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsManagerOrAdmin()]
        return [IsAnyStaff()]

    def perform_create(self, serializer):
        order_number = f"PO-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(created_by=self.request.user, order_number=order_number)

    @action(detail=True, methods=['post'], permission_classes=[IsManagerOrAdmin])
    def approve(self, request, pk=None):
        """Approve a pending order."""
        order = self.get_object()
        if order.status != PurchaseOrder.Status.PENDING:
            return Response({'error': 'Only pending orders can be approved.'},
                            status=status.HTTP_400_BAD_REQUEST)
        order.status = PurchaseOrder.Status.APPROVED
        order.save()
        return Response(PurchaseOrderSerializer(order).data)

    @action(detail=True, methods=['post'])
    def receive(self, request, pk=None):
        """Receive order and automatically add stock for each item."""
        from apps.stock.services import StockService
        order = self.get_object()
        if order.status not in [PurchaseOrder.Status.APPROVED, PurchaseOrder.Status.PENDING]:
            return Response({'error': 'Order must be approved or pending to receive.'},
                            status=status.HTTP_400_BAD_REQUEST)
        for item in order.items.all():
            StockService.add_stock(
                product=item.product,
                quantity=item.quantity,
                reference=f"Purchase Order: {order.order_number}",
                user=request.user,
            )
        order.status = PurchaseOrder.Status.RECEIVED
        order.save()
        return Response({'message': 'Order received. Stock has been updated.'})
