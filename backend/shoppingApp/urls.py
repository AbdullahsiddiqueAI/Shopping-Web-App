from django.urls import path
from .views import *

urlpatterns = [
    path('categories/', CategoryListCreateAPIView.as_view(), name='category-list-create'),
    path('categories/<uuid:pk>/', CategoryDetailAPIView.as_view(), name='category-detail'),

    path('products/', ProductListCreateAPIView.as_view(), name='product-list-create'),
    path('products/<uuid:pk>/', ProductDetailAPIView.as_view(), name='product-detail'),

    path('orders/', OrderListCreateAPIView.as_view(), name='order-list-create'),
    path('orders/<uuid:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),

    path('order-items/', OrderItemListCreateAPIView.as_view(), name='order-item-list-create'),
    path('order-items/<pk>/', OrderItemDetailAPIView.as_view(), name='order-item-detail'),
    path('contact/submit/', submit_contact_form, name='submit_contact_form'),

#     path('payments/', PaymentListCreateAPIView.as_view(), name='payment-list-create'),
#     path('payments/<uuid:pk>/', PaymentDetailAPIView.as_view(), name='payment-detail'),
]

