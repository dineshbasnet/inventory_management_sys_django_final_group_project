from django.contrib import admin
from .models import Stock, StockMovement


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display  = ['product', 'quantity', 'is_low', 'is_out', 'last_updated']
    search_fields = ['product__name', 'product__sku']


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display  = ['product', 'movement_type', 'quantity',
                     'quantity_before', 'quantity_after', 'performed_by', 'created_at']
    list_filter   = ['movement_type']
    search_fields = ['product__name', 'reference']
    readonly_fields = ['quantity_before', 'quantity_after', 'created_at']