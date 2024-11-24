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
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.conf import settings
from django.core.mail import send_mail
from cryptography.fernet import Fernet
signer = TimestampSigner()  
key = settings.FERNET_KEY.encode()

cipher = Fernet(key)  
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
                'error': list(e)[0],  
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

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").lower()

        if not email:
            return Response({"success": False, "error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = UserCustomModel.objects.filter(email=email).first()

        if not user:
            return Response({"success": False, "error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Generate a signed token with a 30-minute expiration
        try:
            token = signer.sign(email)  # Token for expiration
            encrypted_email = cipher.encrypt(email.encode()).decode()  # Encrypt the email
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        reset_url = f"{settings.FRONTEND_URL}/ResetPassword?token={token}&email={encrypted_email}"
        # Send the reset email
        try:
            print("reset url",reset_url)
            send_mail(
                subject="Password Reset Request",
                message=f"Click the link below to reset your password. This link will expire in 30 minutes:\n\n{reset_url}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"success": True, "message": "Password reset email sent"}, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token", None)
        encrypted_email = request.data.get("email", None)
        new_password = request.data.get("password", None)

        if not (token and encrypted_email and new_password):
            return Response({"success": False, "error": "Token, email, and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify token expiration
            email = signer.unsign(token, max_age=1800)
            
            # Decrypt email
            decrypted_email = cipher.decrypt(encrypted_email.encode()).decode()

            # Ensure email matches
            if email != decrypted_email:
                return Response({"success": False, "error": "Invalid email or token"}, status=status.HTTP_400_BAD_REQUEST)

            # Find user by email
            user = UserCustomModel.objects.filter(email=decrypted_email).first()
            if not user:
                return Response({"success": False, "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

            # Set the new password
            user.set_password(new_password)
            user.save()

        except SignatureExpired:
            return Response({"success": False, "error": "The reset link has expired"}, status=status.HTTP_400_BAD_REQUEST)
        except (BadSignature, Exception) as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"success": True, "message": "Password reset successfully"}, status=status.HTTP_200_OK)

class ValidateResetLinkView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get("token", None)
        encrypted_email = request.query_params.get("email", None)

        if not (token and encrypted_email):
            return Response({"success": False, "error": "Token and email are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify token expiration
            email = signer.unsign(token, max_age=1800)  # 1800 seconds = 30 minutes
            
            # Decrypt email
            decrypted_email = cipher.decrypt(encrypted_email.encode()).decode()

            # Ensure email matches
            if email != decrypted_email:
                return Response({"success": False, "error": "Invalid email or token"}, status=status.HTTP_400_BAD_REQUEST)

        except SignatureExpired:
            return Response({"success": False, "error": "The reset link has expired"}, status=status.HTTP_400_BAD_REQUEST)
        except (BadSignature, Exception) as e:
            return Response({"success": False, "error": "Invalid token or email"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"success": True, "message": "Link is valid. Proceed to reset your password."}, status=status.HTTP_200_OK)

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
