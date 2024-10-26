from channels.db import database_sync_to_async
from django.conf import settings
from django.core.exceptions import ValidationError
import jwt  # Import the jwt module
from jwt import decode  # Import the decode function


from core.models import *


@database_sync_to_async
def get_user(user_id):
    return UserCustomModel.objects.filter(pk=user_id).first()


class QueryAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        try:
            token = scope['query_string'].decode('utf-8')[6:].split('/')[0]
            data = decode(token, settings.SECRET_KEY, algorithms='HS256')
            print('data',data) 
            
            scope['user'] = await get_user(data['user_id'])
        except Exception as e:
            print(e, ValidationError('Authentication Failed!'))
        return await self.app(scope, receive, send)