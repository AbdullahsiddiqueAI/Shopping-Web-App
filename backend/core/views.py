from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserCustomModel
from rest_framework.permissions import AllowAny
import json
import requests



def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# Create your views here.
class SignUpView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer


    def post(self, request):
        provider = str(request.data.get('accountType')).lower()
        password = request.data.get('password', None)
        if not password:
            return Response({"success": False, "error":"password required","status":404},status=status.HTTP_400_BAD_REQUEST) 
        serializer = UserSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({
                "user": serializer.data,
                "tokens": get_tokens_for_user(serializer.instance),
                "status": 201
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            
            return Response({
                'error': str(e),
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
class LoginView(APIView):
    permission_classes = [AllowAny]


    def post(self, request):
        email = request.data.get('email').lower()
        user = UserCustomModel.objects.filter(email=email).first()
        password = request.data.get('password', None)
        if user is None:
            return Response({"error": "Invalid Credentials"}, status=status.HTTP_404_NOT_FOUND) 
        if password is None:
            return Response({"error": "Password is required", "status": status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(password):
            return Response({"error": "Invalid Credentials"}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "user": UserSerializer(user).data,
            "tokens": get_tokens_for_user(user),
            "status": "200"
        }, status=status.HTTP_200_OK)
