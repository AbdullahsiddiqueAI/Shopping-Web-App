# urls.py

from django.urls import path
from .views import StripePaymentView
from shoppingApp.views import *

urlpatterns = [
    path('payment/', StripePaymentView.as_view(), name='stripe-payment'),
    path('payment/admin/', PaymentListCreateAPIView.as_view(), name='stripe-payment'),
    path('payment/admin/<pk>/', PaymentDetailAPIView.as_view(), name='stripe-payment'),
]
