from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserModelManager
import uuid



class UserCustomModel(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name=models.CharField(max_length=255,blank=True, null=True)
    email = models.EmailField(unique=True)
    phoneNumber=models.CharField(max_length=11,blank=True,null=True)
    address=models.TextField(blank=True, null=True)
    password = models.CharField(max_length=255,null=False,blank=False,default='null')
    proficPhoto=models.ImageField(blank=True, null=True,upload_to='profilePhotos/')
    username = None
    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'email'
    objects = UserModelManager()


    def __str__(self):
        return self.email