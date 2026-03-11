from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Only admin role."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')


class IsManagerOrAdmin(BasePermission):
    """Admin or manager role."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and request.user.role in ['admin', 'manager'])


class IsAnyStaff(BasePermission):
    """Any authenticated user."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
