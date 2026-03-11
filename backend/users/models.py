from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN   = 'admin',   'Admin'
        MANAGER = 'manager', 'Manager'
        STAFF   = 'staff',   'Staff'
        
        
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20,choices=Role.choices,default=Role.STAFF)
    phone = models.CharField(max_length=10,blank=True)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
        