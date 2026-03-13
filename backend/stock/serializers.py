from rest_framework import serializers
from .models import Stock, StockMovement


class StockSerializer(serializers.ModelSerializer):
    product_name= serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    minimum_stock = serializers.IntegerField(source='product.minimum_stock', read_only=True)
    is_low = serializers.ReadOnlyField()
    is_out  = serializers.ReadOnlyField()

    class Meta:
        model  = Stock
        fields = ['id', 'product', 'product_name', 'product_sku',
                  'quantity', 'minimum_stock', 'is_low', 'is_out', 'last_updated']


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    performed_by_name = serializers.CharField(source='performed_by.get_full_name', read_only=True)

    class Meta:
        model  = StockMovement
        fields = ['id', 'product', 'product_name', 'movement_type',
                  'quantity', 'quantity_before', 'quantity_after',
                  'reference', 'notes', 'performed_by_name', 'created_at']


class StockAddRemoveSerializer(serializers.Serializer):
    product  = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    reference = serializers.CharField(required=False, allow_blank=True)
    notes= serializers.CharField(required=False, allow_blank=True)


class StockAdjustSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    new_quantity = serializers.IntegerField(min_value=0)
    notes = serializers.CharField(required=False, allow_blank=True)