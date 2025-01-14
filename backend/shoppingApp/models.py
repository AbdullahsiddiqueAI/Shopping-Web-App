import uuid
from django.db import models
from core.models import UserCustomModel as User
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

# Create your models here.

class Category(models.Model):
    category_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Categoryicon=models.ImageField(null=True, blank=True,upload_to='category')
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    product_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    productPic=models.ImageField(null=True, blank=True,upload_to='products')
    name = models.CharField(max_length=255) 
    is_featured = models.BooleanField(default=False) 
    description = models.TextField(null=True,blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    @classmethod
    def total_products(cls):
        return cls.objects.count()

    def __str__(self):
        return self.name

class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ('Placed', 'Placed'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Canceled', 'Canceled'),
    ]

    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, related_name='orders', on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='Placed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def total_sales(cls):
        return str(cls.objects.exclude(status='cancel').aggregate(total=Sum('total_amount'))['total'] or 0.00)

    @classmethod
    def total_orders(cls):
        return cls.objects.count()
    
    
    def __str__(self):
        return f"Order {self.order_id}"

class OrderItem(models.Model):
    order_item_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, related_name='order_items', on_delete=models.CASCADE,null=True,blank=True)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    

    def __str__(self):
        return f"OrderItem {self.order_item_id}"

    
class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    message = models.TextField()

    def __str__(self):
        return self.name
