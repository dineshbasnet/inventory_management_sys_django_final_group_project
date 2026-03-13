from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, F
from django.utils import timezone
from datetime import timedelta
from products.models import Product
from stock.models import Stock, StockMovement
from orders.models import PurchaseOrder
from core.permissions.roles import IsManagerOrAdmin, IsAnyStaff


class DashboardView(APIView):
  
    permission_classes = [IsAnyStaff]

    def get(self, request):
        total_products  = Product.objects.filter(is_active=True).count()
        out_of_stock    = Stock.objects.filter(quantity=0).count()
        low_stock       = Stock.objects.filter(
            quantity__gt=0, quantity__lte=F('product__minimum_stock')
        ).count()
        pending_orders  = PurchaseOrder.objects.filter(
            status__in=[PurchaseOrder.Status.PENDING, PurchaseOrder.Status.APPROVED]
        ).count()
        inventory_value = Stock.objects.annotate(
            value=F('quantity') * F('product__cost_price')
        ).aggregate(total=Sum('value'))['total'] or 0

        return Response({
            'total_products':       total_products,
            'out_of_stock':         out_of_stock,
            'low_stock':            low_stock,
            'pending_orders':       pending_orders,
            'total_inventory_value': round(float(inventory_value), 2),
        })


class StockReportView(APIView):
 
    permission_classes = [IsManagerOrAdmin]

    def get(self, request):
        stocks = Stock.objects.select_related('product__category').annotate(
            total_value=F('quantity') * F('product__cost_price')
        ).order_by('-total_value')

        data = [{
            'product_id':    s.product.id,
            'product_name':  s.product.name,
            'sku':           s.product.sku,
            'category':      s.product.category.name if s.product.category else '',
            'quantity':      s.quantity,
            'cost_price':    float(s.product.cost_price),
            'total_value':   float(s.total_value or 0),
            'status':        'out' if s.is_out else ('low' if s.is_low else 'ok'),
        } for s in stocks]

        return Response({
            'total_items': len(data),
            'total_value': sum(d['total_value'] for d in data),
            'report':      data,
        })


class MovementReportView(APIView):
   
    permission_classes = [IsManagerOrAdmin]

    def get(self, request):
        days  = int(request.query_params.get('days', 30))
        since = timezone.now() - timedelta(days=days)
        movements = StockMovement.objects.filter(
            created_at__gte=since
        ).values('movement_type').annotate(
            count=Count('id'),
            total_quantity=Sum('quantity'),
        )
        return Response({
            'period_days':       days,
            'movements_by_type': list(movements),
        })