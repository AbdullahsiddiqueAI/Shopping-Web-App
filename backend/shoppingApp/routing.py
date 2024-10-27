# shoppingApp/routing.py
from django.urls import path
from .consumer import DashboardStatsConsumer

websocket_urlpatterns = [
    path('ws/DashboardStats/', DashboardStatsConsumer.as_asgi()),  # Adjust the URL as needed
]
