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

from django.db import transaction
from rest_framework.permissions import IsAuthenticated

stripe.api_key = settings.STRIPE_SECRET_KEY


# transaction.set_rollback()
class StripePaymentView(APIView):
    """
    View to handle both Order creation and Stripe payment in one atomic transaction.
    If any step fails, all changes will be rolled back.
    """

    @transaction.atomic  
    def post(self, request):
        
        serializer = OrderSerializer(data=request.data, context={'request': request})
        try:
            if serializer.is_valid():
                
                order = serializer.save()

                
                token = request.data.get('token')
                amount = request.data.get('total_amount')  
                
                
                charge = stripe.Charge.create(
                    amount=amount*100,  
                    currency="usd",
                    description=f"Order {order.order_id}",
                    source=token,
                )
                print("charge",charge.keys())
               
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

            
                if charge.status == 'succeeded':
                    return Response({
                        "success": True,
                        "message": "Order and payment processed successfully!",
                        "order": serializer.data,
                        "charge_id": charge.id,
                        "payment_status": payment_status,
                    }, status=status.HTTP_201_CREATED)

                
                else:
                    raise Exception("Payment failed")

            else:
                return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        
        except stripe.error.StripeError as e:
            transaction.set_rollback(True)  
            return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            transaction.set_rollback(True)  
            return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
