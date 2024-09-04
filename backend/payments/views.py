# views.py        
import stripe
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from shoppingApp.models import Order
from rest_framework.views import APIView
from core.models import *
from .serializer import PaymentSerializer
# from .serializer import PaymentSerializer
from rest_framework.permissions import IsAuthenticated

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripePaymentView(APIView):
    # permission_classes = [IsAuthenticated]  # Only allow authenticated users
    def get(self, request, *args, **kwargs):
        payments = Payment.objects.filter(user_id=request.user.id)
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)
        
    def post(self, request):
        order_id = request.data.get('order_id')
        token = request.data.get('token')
        amount = request.data.get('amount')  # This should be in cents

        try:
            order = Order.objects.get(order_id=order_id)

            # Create a Stripe charge
            charge = stripe.Charge.create(
                amount=amount,  # Stripe uses cents
                currency="usd",
                description=f"Order {order.order_id}",
                source=token,
                
                
            )
            user=UserCustomModel.objects.filter(pk="f5a61daa2b7d49f3af20db6f42aa06de").first()
            # Save payment details in the database
            payment = Payment.objects.create(
                user=user,
                order=order,
                amount=amount / 100,  # Convert cents to dollars
                status='Completed' if charge.status == 'succeeded' else 'Failed',
            )

            return Response({
                "message": "Payment successful!",
                # "payment_id": payment.payment_id,
                "charge_id": charge.id,
            }, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# from rest_framework.views import APIView

# stripe.api_key = settings.STRIPE_SECRET_KEY

# class StripePaymentView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = StripePaymentSerializer(data=request.data)
        
#         if serializer.is_valid():
#             amount = serializer.validated_data['amount']
#             currency = serializer.validated_data['currency']
#             description = serializer.validated_data['description']
#             token = serializer.validated_data['token']
            
#             try:
#                 # Create a Stripe charge
#                 charge = stripe.Charge.create(
#                     amount=amount,
#                     currency=currency,
#                     description=description,
#                     source=token
#                 )
                
#                 # Save payment details in the database
#                 payment = Payment.objects.create(
#                     stripe_charge_id=charge.id,
#                     amount=amount / 100,  # Amount is in cents, convert to dollars
#                     currency=currency,
#                     description=description,
#                     status=charge.status,
#                 )
                
#                 return Response({"message": "Payment successful!", "charge_id": charge.id}, status=status.HTTP_200_OK)
            
#             except stripe.error.CardError as e:
#                 return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
