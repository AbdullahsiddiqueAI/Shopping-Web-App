from django.urls import path
from .views import *


from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
urlpatterns = [
  path('refreshToken/', TokenRefreshView.as_view(), name='token_refresh'),
  path('signup/', SignUpView.as_view(), name='signup'),
  path('login/', LoginView.as_view(), name='login'),
]