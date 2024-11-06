# models.py

from django.db import models
from shoppingApp.models import *
from core.models import UserCustomModel as User
class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    ]
    stripe_charge_id = models.CharField(max_length=100)
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    currency = models.CharField(max_length=10)
    description = models.CharField(max_length=255)
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.OneToOneField(Order, related_name='payment', on_delete=models.CASCADE)
    status = models.CharField(max_length=50,choices=PAYMENT_STATUS_CHOICES,default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} - {self.amount} {self.currency}"
