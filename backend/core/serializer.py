import re
from django.core.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer
from .models import UserCustomModel



class UserSerializer(ModelSerializer):
    class Meta:
        model = UserCustomModel
        fields = ['id','email', 'first_name', 'last_name', 'password','profilePhoto','phoneNumber','address','is_superuser']
        extra_kwargs = {
            'password': {'write_only': True}
        }


    def create(self, validated_data):
        validated_data['email'] = validated_data['email'].lower()
        user = UserCustomModel.objects.filter(email=validated_data['email'])
        if user.exists():
            raise ValidationError("Email already exists")
        user = UserCustomModel.objects.create_user(**validated_data)
        return user


    def validate(self, validated_data):
        
        password = validated_data.get('password', '')
        if password:
            if len(password) < 8:
                raise ValidationError("Password must be at least 8 characters long.")
            if not re.search(r'[A-Z]', password):
                raise ValidationError("Password must contain at least one uppercase letter.")
            if not re.search(r'[a-z]', password):
                raise ValidationError("Password must contain at least one lowercase letter.")
            if not re.search(r'[0-9]', password):
                raise ValidationError("Password must contain at least one digit.")
            if not re.search(r'[!@#$%^&*()_+{}|:"<>?]', password):
                raise ValidationError("Password must contain at least one special character.")
        return validated_data

