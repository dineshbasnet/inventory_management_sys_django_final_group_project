from rest_framework import serializers
from .models import PurchaseOrder, PurchaseOrderItem


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    total_price  = serializers.ReadOnlyField()

    class Meta:
        model  = PurchaseOrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'total_price']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    items          = PurchaseOrderItemSerializer(many=True)
    total_amount   = serializers.ReadOnlyField()
    supplier_name  = serializers.CharField(source='supplier.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model  = PurchaseOrder
        fields = [
            'id', 'order_number', 'supplier', 'supplier_name',
            'status', 'created_by', 'created_by_name',
            'expected_delivery', 'notes', 'total_amount',
            'items', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'order_number', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = PurchaseOrder.objects.create(**validated_data)
        for item in items_data:
            PurchaseOrderItem.objects.create(order=order, **item)
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        instance = super().update(instance, validated_data)
        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                PurchaseOrderItem.objects.create(order=instance, **item)
        return instance
