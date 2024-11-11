"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 5.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'your_default_secret_key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG')

# ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(',')
ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    "daphne",
    'channels',
    'corsheaders',
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'rest_framework',
    'rest_framework_simplejwt',
    'core',
    'shoppingApp',
    'payments',
]
CORS_ALLOWED_ORIGINS = [
    # "http://localhost:3000",
    # "http://localhost:5173",
    "http://*"# Vite dev server
   
]
CSRF_TRUSTED_ORIGINS = [
    'http://shoppingapp.dfwcz.com',
   'http://54.144.249.124/'
]
CORS_ALLOW_ALL_ORIGINS = True
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# WSGI_APPLICATION = "backend.wsgi.application"
ASGI_APPLICATION = 'backend.asgi.application' 

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

AUTH_USER_MODEL='core.UserCustomModel'
# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}




SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=10),  # Set access token lifetime
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),    # Set refresh token lifetime
    'ROTATE_REFRESH_TOKENS': False,                # If True, refresh token will be rotated and the old token will be blacklisted
    'BLACKLIST_AFTER_ROTATION': True,              # If True, blacklisted tokens cannot be used anymore
    'UPDATE_LAST_LOGIN': False,                    # If True, the last login field will be updated on refresh

    'ALGORITHM': 'HS256',                          # Algorithm used for encoding JWT
    'SIGNING_KEY': SECRET_KEY,                     # Signing key for encoding JWT (typically your Django SECRET_KEY)
    'VERIFYING_KEY': None,                         # Verifying key for decoding JWT (if you use asymmetric algorithms)
    'AUDIENCE': None,                              # Expected audience claim
    'ISSUER': None,                                # Expected issuer claim

    'AUTH_HEADER_TYPES': ('Bearer',),              # Types of authorization headers
    'USER_ID_FIELD': 'id',                         # User ID field
    'USER_ID_CLAIM': 'user_id',                    # User ID claim
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),  # Classes for token objects
    'TOKEN_TYPE_CLAIM': 'token_type',              # Token type claim

    'JTI_CLAIM': 'jti',                            # JWT ID claim
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',  # Sliding token refresh expiration claim
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),    # Sliding token lifetime
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1), # Sliding token refresh lifetime
}
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
    os.path.join(BASE_DIR, 'staticfiles'),
]
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files (Uploaded by users)
MEDIA_URL = 'api/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media') 

STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
STRIPE_PUBLISHABLE_KEY =  os.getenv("STRIPE_PUBLISHABLE_KEY")




CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',  # or 'channels_redis.core.RedisChannelLayer' for Redis
    }
}
ASGI_APPLICATION = 'backend.asgi.application'