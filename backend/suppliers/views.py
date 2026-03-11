from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from .models import Supplier
from .serializers import SupplierSerializer
from core.permissions.roles import IsManagerOrAdmin, IsAnyStaff


class SupplierViewSet(viewsets.ModelViewSet):
 
    queryset         = Supplier.objects.all()
    serializer_class = SupplierSerializer
    filter_backends  = [SearchFilter]
    search_fields    = ['name', 'company', 'email']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManagerOrAdmin()]
        return [IsAnyStaff()]
