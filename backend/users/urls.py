from django.urls import path
from .views import (
    LoginView,
    LogoutView,
    RegisterView,
    UserMeView,
    UserListView,
    UserDetailView,
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
    path("users/me/", UserMeView.as_view(), name="user-me"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
]
