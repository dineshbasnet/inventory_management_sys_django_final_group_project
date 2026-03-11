from django.contrib import admin
from .models import Supplier


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display  = ['name', 'company', 'email', 'phone', 'is_active']
    list_filter   = ['is_active']
    search_fields = ['name', 'company', 'email']