from rest_framework import serializers
from .models import *
from core.models import UserCustomModel as User
from core.serializer import UserSerializer
from payments.models import Payment
from django.db import transaction
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name', 'description','Categoryicon', 'created_at', 'updated_at']

class ProductSerializer(serializers.ModelSerializer):
    
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['product_id', "productPic", 'name', 'description', 'price', 'category', 'stock', 'created_at', 'updated_at','is_featured']

   
    def create(self, validated_data):
        category_data = self.initial_data.get('category')
        category = Category.objects.get(category_id=category_data['category_id'])
        validated_data['category'] = category
        return super().create(validated_data)

    def update(self, instance, validated_data):
        category_data = self.initial_data.get('category')

     
        if isinstance(category_data, dict):
            category_id = category_data.get('category_id')
        else:
            category_id = category_data 

        
        if category_id:
            try:
                category = Category.objects.get(category_id=category_id)
                validated_data['category'] = category
            except Category.DoesNotExist:
                raise serializers.ValidationError("Invalid category ID provided.")

     
        instance = super().update(instance, validated_data)
        return instance

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  
    order_items = serializers.SerializerMethodField()  

    class Meta:
        model = Order
        fields = ['order_id', 'order_date', 'user', 'total_amount', 'status', 'created_at', 'updated_at', 'order_items']

    def get_order_items(self, obj):
        order_items = OrderItem.objects.filter(order=obj)
        serializer = OrderItemSerializer(order_items, many=True)
        return serializer.data

    def create(self, validated_data):
        user = self.context['request'].user  
        order_items = OrderItem.objects.filter(user_id=user.id, order__isnull=True)
        print("order_items", order_items)

        if not order_items:
            raise serializers.ValidationError("OrderItems is Empty")

        with transaction.atomic():  
            order = Order.objects.create(user=user, **validated_data)
            for order_item in order_items:
               
                if order_item.product.stock < order_item.quantity:
                    raise serializers.ValidationError(
                        f"Insufficient stock for product {order_item.product.name}"
                    )
                
                
                order_item.product.stock -= order_item.quantity
                order_item.product.save()

               
                order_item.order = order
                order_item.save()
        
        return order

    # def update(self, instance, validated_data):
    #     instance.status = validated_data.get('status', instance.status)
    #     instance.total_amount = validated_data.get('total_amount', instance.total_amount)
    #     instance.save()
    #     return instance

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    user = UserSerializer(read_only=True)  

    class Meta:
        model = OrderItem
        fields = ['order_item_id', 'order', 'product', 'quantity', 'price', 'user']
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user  

        
        product_id = self.initial_data.get('product')
        product = Product.objects.get(product_id=product_id)

        
        order_data = self.initial_data.get('order')
        order_item = OrderItem.objects.create(user=user, product=product, **validated_data)
        return order_item

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.price = validated_data.get('price', instance.price)
        instance.total = validated_data.get('total', instance.total)
        instance.save()
        return instance


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    
    user=UserSerializer(read_only=True)
    class Meta:
        model = Payment
        fields = '__all__'

