# views.py        
import stripe
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from shoppingApp.models import *
from shoppingApp.serializer import *
from rest_framework.views import APIView
from core.models import *
from .serializer import PaymentSerializer
# from .serializer import PaymentSerializer
from django.db import transaction
from rest_framework.permissions import IsAuthenticated

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripePaymentView(APIView):
    """
    View to handle both Order creation and Stripe payment in one atomic transaction.
    If any step fails, all changes will be rolled back.
    """

    @transaction.atomic  # Ensure the entire operation is atomic
    def post(self, request):
        # Step 1: Order Creation
        serializer = OrderSerializer(data=request.data, context={'request': request})
        try:
            if serializer.is_valid():
                # Save the order (but don't commit yet to allow rollback if payment fails)
                order = serializer.save()

                # Step 2: Payment Processing
                token = request.data.get('token')
                amount = request.data.get('total_amount')  # This should be in cents
                
                # Create a Stripe charge
                charge = stripe.Charge.create(
                    amount=amount*100,  # Amount in cents
                    currency="usd",
                    description=f"Order {order.order_id}",
                    source=token,
                )
                print("charge",charge.keys())
                # If charge succeeds, save payment information
                user = UserCustomModel.objects.filter(pk=request.user.id).first()
                payment_status = 'Completed' if charge.status == 'succeeded' else 'Failed'
                
                payment = Payment.objects.create(
                    stripe_charge_id=charge.id,
                    user=user,
                    order=order,
                    currency="usd",
                    amount=amount, 
                    description=f"Order {order.order_id}",
                    status=payment_status,
                )

                # If payment is successful, return success response
                if charge.status == 'succeeded':
                    return Response({
                        "success": True,
                        "message": "Order and payment processed successfully!",
                        "order": serializer.data,
                        "charge_id": charge.id,
                        "payment_status": payment_status,
                    }, status=status.HTTP_201_CREATED)

                # If payment failed, raise an exception to trigger rollback
                else:
                    raise Exception("Payment failed")

            else:
                return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # Catching all potential errors and ensuring atomic rollback
        except stripe.error.StripeError as e:
            transaction.set_rollback(True)  # Rollback the transaction
            return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            transaction.set_rollback(True)  # Rollback the transaction in case of any failure
            return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
# class StripePaymentView(APIView):
#     # permission_classes = [IsAuthenticated]  # Only allow authenticated users
#     def get(self, request, *args, **kwargs):
#         payments = Payment.objects.filter(user_id=request.user.id)
#         serializer = PaymentSerializer(payments, many=True)
#         return Response(serializer.data)
        
#     def post(self, request):
#         order_id = request.data.get('order_id')
#         token = request.data.get('token')
#         amount = request.data.get('total_amount')  # This should be in cents

#         try:
#             order = Order.objects.get(order_id=order_id)

#             # Create a Stripe charge
#             charge = stripe.Charge.create(
#                 amount=amount,  # Stripe uses cents
#                 currency="usd",
#                 description=f"Order {order.order_id}",
#                 source=token,
                
                
#             )
#             user=UserCustomModel.objects.filter(pk=request.user.id).first()
#             # Save payment details in the database
#             payment = Payment.objects.create(
#                 user=user,
#                 order=order,
#                 amount=amount, 
#                 status='Completed' if charge.status == 'succeeded' else 'Failed',
#             )

#             return Response({
#                 "message": "Payment successful!",
#                 # "payment_id": payment.payment_id,
#                 "charge_id": charge.id,
#             }, status=status.HTTP_200_OK)

#         except Order.DoesNotExist:
#             return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

#         except stripe.error.StripeError as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        
