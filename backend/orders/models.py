from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from apps.products.models import Product
from apps.suppliers.models import Supplier


class PurchaseOrder(models.Model):
    class Status(models.TextChoices):
        DRAFT     = 'draft',     'Draft'
        PENDING   = 'pending',   'Pending'
        APPROVED  = 'approved',  'Approved'
        RECEIVED  = 'received',  'Received'
        CANCELLED = 'cancelled', 'Cancelled'

    order_number       = models.CharField(max_length=50, unique=True)
    supplier           = models.ForeignKey(Supplier, on_delete=models.PROTECT,
                                           related_name='purchase_orders')
    status             = models.CharField(max_length=20, choices=Status.choices,
                                          default=Status.DRAFT)
    created_by         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                           null=True, related_name='orders_created')
    expected_delivery  = models.DateField(null=True, blank=True)
    notes              = models.TextField(blank=True)
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'purchase_orders'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.order_number} — {self.supplier.name}"

    @property
    def total_amount(self):
        return sum(item.total_price for item in self.items.all())


class PurchaseOrderItem(models.Model):
    order      = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    product    = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity   = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2,
                                     validators=[MinValueValidator(0)])

    class Meta:
        db_table = 'purchase_order_items'

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    @property
    def total_price(self):
        return self.unit_price * self.quantity
