from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserCustomModel
from rest_framework.permissions import AllowAny,IsAuthenticated
import json
import requests
from rest_framework.exceptions import *
# from rest_framework.exceptions import ErrorDetail


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
            return Response({"success": False, "error": "password required", "status": 404}, status=status.HTTP_400_BAD_REQUEST) 
        
        serializer = UserSerializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({
                "user": serializer.data,
                "tokens": get_tokens_for_user(serializer.instance),
                "status": 201
            }, status=status.HTTP_201_CREATED)
        
        except ValidationError as e:
            # Handle ValidationError from DRF, which contains `detail`
            error_message = (
                e.detail.get('email', [""])[0].strip()
                if isinstance(e.detail, dict) and 'email' in e.detail
                else str(e.detail)
            )
            return Response({
                'error': error_message,
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Handle other unexpected exceptions
            return Response({
                'error': 'An unexpected error occurred: ' + str(e),
                'status': 500
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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




class UserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user=request.user
        serializer = UserSerializer(user)
        return Response({"success": True, "user": serializer.data, "status": "200"}, 
                                status=status.HTTP_200_OK)
        

    def post(self, request):
        user = request.user
        current_password = request.data.get('currentPassword', None)

        # Check if current password is provided
        if current_password:
            # Check if the current password is correct
            if not user.check_password(current_password):
                return Response({"success": False, "error": "Current password is wrong", "status": "400"}, 
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                new_password = request.data.get('password', None)
                if not new_password:
                    return Response({"success": False, "error": "New password is required", "status": "400"}, 
                                status=status.HTTP_400_BAD_REQUEST)
                user.set_password(new_password)
                user.save()
            
        data=request.data.copy()
        data.pop('password', None)
        # Deserialize user data
        serializer = UserSerializer(user, data=data, partial=True)  # partial=True allows partial updates

        # Validate and save serializer
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"success": False, "errors": serializer.errors, "status": "400"}, 
                            status=status.HTTP_400_BAD_REQUEST)
