from rest_framework import serializers
from .models import Payment
from shoppingApp.models import Order
from core.models import UserCustomModel as User
from shoppingApp.serializer import OrderSerializer  # Assuming you already have a serializer for Order
from core.serializer import UserSerializer  # Assuming you already have a serializer for User

class PaymentSerializer(serializers.ModelSerializer):
    # Include detailed information about the user and order
    user = UserSerializer(read_only=True)
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'stripe_charge_id', 'amount', 'currency', 'description', 'user', 'order', 'status', 'created_at']
