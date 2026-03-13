from django.db import models
from django.conf import settings
from products.models import Product


class Stock(models.Model):
    """
    Represents the current stock level of a product.
    Each product has exactly one stock record.
    """

    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name="stock"
    )
    quantity = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "stock"

    def __str__(self):
        return f"{self.product.name}: {self.quantity}"

    @property
    def is_low(self):
        """Return True if stock is at or below minimum level."""
        return self.quantity <= self.product.minimum_stock

    @property
    def is_out(self):
        """Return True if product is out of stock."""
        return self.quantity == 0


class StockMovement(models.Model):
    """
    Stores the history of all stock transactions.
    """

    class MovementType(models.TextChoices):
        IN = "in", "Stock In"
        OUT = "out", "Stock Out"
        ADJUSTMENT = "adjustment", "Adjustment"
        DAMAGE = "damage", "Damage / Loss"

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="movements"
    )

    movement_type = models.CharField(
        max_length=20,
        choices=MovementType.choices
    )

    quantity = models.IntegerField()  # +ve for stock in, -ve for stock out
    quantity_before = models.PositiveIntegerField()
    quantity_after = models.PositiveIntegerField()

    reference = models.CharField(
        max_length=200,
        blank=True
    )

    notes = models.TextField(
        blank=True
    )

    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "stock_movements"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.product.name} | {self.movement_type} | {self.quantity}"