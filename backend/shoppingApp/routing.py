# shoppingApp/routing.py
from django.urls import re_path
from .consumer import DashboardStatsConsumer

websocket_urlpatterns = [
    re_path(r'ws/DashboardStats/$', DashboardStatsConsumer.as_asgi()),  # Adjust the URL as needed
]
