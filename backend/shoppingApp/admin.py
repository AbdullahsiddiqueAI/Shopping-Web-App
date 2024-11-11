from django.contrib import admin
from .models import Category, Product, Order, OrderItem, Contact  # Include Payment if uncommented

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at', 'updated_at']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'stock', 'is_featured', 'category', 'created_at', 'updated_at']
    list_filter = ['is_featured', 'category']
    search_fields = ['name', 'description']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'user', 'total_amount', 'status', 'order_date', 'created_at', 'updated_at']
    list_filter = ['status']
    search_fields = ['order_id', 'user__username']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'user', 'price']
    search_fields = ['order__order_id', 'product__name', 'user__username']

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'message']
    search_fields = ['name', 'email', 'phone']
