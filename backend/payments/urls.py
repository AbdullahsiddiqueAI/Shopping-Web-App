# urls.py

from django.urls import path
from .views import StripePaymentView

urlpatterns = [
    path('payment/', StripePaymentView.as_view(), name='stripe-payment'),
]
