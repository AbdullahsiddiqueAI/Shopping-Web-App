from django.urls import path
from .views import *


from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
urlpatterns = [
  path('refreshToken/', TokenRefreshView.as_view(), name='token_refresh'),
  path('signup/', SignUpView.as_view(), name='signup'),
  path('login/', LoginView.as_view(), name='login'),
  path('user/', UserView.as_view(), name='UserView'),
  path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
  path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
  path('validate-reset-link/', ValidateResetLinkView.as_view(), name='validate-reset-link')
]