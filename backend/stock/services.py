from django.db import transaction
from .models import Stock, StockMovement


class StockService:
    """All stock operations go through here to keep logic in one place."""

    @staticmethod
    @transaction.atomic
    def add_stock(product, quantity, reference="", notes="", user=None):
        stock, _ = Stock.objects.get_or_create(product=product)
        before = stock.quantity
        stock.quantity += quantity
        stock.save()
        StockMovement.objects.create(
            product=product,
            movement_type=StockMovement.MovementType.IN,
            quantity=quantity,
            quantity_before=before,
            quantity_after=stock.quantity,
            reference=reference,
            notes=notes,
            performed_by=user,
        )
        return stock

    @staticmethod
    @transaction.atomic
    def remove_stock(product, quantity, reference="", notes="", user=None):
        stock, _ = Stock.objects.get_or_create(product=product)
        if stock.quantity < quantity:
            raise ValueError(
                f"Insufficient stock. Available: {stock.quantity}, Requested: {quantity}"
            )
        before = stock.quantity
        stock.quantity -= quantity
        stock.save()
        StockMovement.objects.create(
            product=product,
            movement_type=StockMovement.MovementType.OUT,
            quantity=-quantity,
            quantity_before=before,
            quantity_after=stock.quantity,
            reference=reference,
            notes=notes,
            performed_by=user,
        )
        return stock

    @staticmethod
    @transaction.atomic
    def adjust_stock(product, new_quantity, notes="", user=None):
        stock, _ = Stock.objects.get_or_create(product=product)
        before = stock.quantity
        stock.quantity = new_quantity
        stock.save()
        StockMovement.objects.create(
            product=product,
            movement_type=StockMovement.MovementType.ADJUSTMENT,
            quantity=new_quantity - before,
            quantity_before=before,
            quantity_after=new_quantity,
            notes=notes,
            performed_by=user,
        )
        return stock
