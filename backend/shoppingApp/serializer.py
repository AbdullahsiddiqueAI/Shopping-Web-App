from rest_framework import serializers
from .models import Category, Product, Order, OrderItem, Payment
from core.models import UserCustomModel as User
from core.serializer import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name', 'description', 'created_at', 'updated_at']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()  

    class Meta:
        model = Product
        fields = ['product_id', 'name', 'description', 'price', 'stock', 'category', 'created_at', 'updated_at']


class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer() 
    order_items = serializers.SerializerMethodField()  

    class Meta:
        model = Order
        fields = ['order_id', 'order_date', 'user', 'total_amount', 'status', 'created_at', 'updated_at', 'order_items']

    def get_order_items(self, obj):
        order_items = OrderItem.objects.filter(order=obj)
        serializer = OrderItemSerializer(order_items, many=True)
        return serializer.data

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  

    class Meta:
        model = OrderItem
        fields = ['order_item_id', 'order', 'product', 'quantity', 'price', 'total']

class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer()  
    class Meta:
        model = Payment
        fields = ['payment_id', 'order', 'payment_date', 'amount', 'status', 'created_at', 'updated_at']
