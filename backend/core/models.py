from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserModelManager
import uuid
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta



class UserCustomModel(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name=models.CharField(max_length=255,blank=True, null=True)
    email = models.EmailField(unique=True)
    phoneNumber=models.CharField(max_length=11,blank=True,null=True)
    address=models.TextField(blank=True, null=True)
    password = models.CharField(max_length=255,null=False,blank=False,default='null')
    profilePhoto=models.ImageField(blank=True, null=True,upload_to='profilePhotos/')
    username = None
    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'email'
    created_at = models.DateTimeField(auto_now_add=True,blank=True, null=True)
    objects = UserModelManager()
    @classmethod
    def new_users(cls):
        # Assuming you want users created in the last 30 days
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return cls.objects.filter(created_at__gte=thirty_days_ago).count()


    def __str__(self):
        return self.email