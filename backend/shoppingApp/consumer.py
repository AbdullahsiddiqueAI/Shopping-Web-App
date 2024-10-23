# myapp/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MyConsumer(AsyncWebsocketConsumer):
    connected_users = set()  # Track connected users

    async def connect(self):
        # Accept the connection
        await self.accept()
        
        # Add user to connected users
        self.connected_users.add(self.channel_name)
        await self.send(text_data=json.dumps({
            'message': 'You are connected!',
            'users': list(self.connected_users)
        }))

    async def disconnect(self, close_code):
        # Remove user from connected users
        self.connected_users.remove(self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'chat_message':
                await self.handle_chat_message(data)
            else:
                await self.send(text_data=json.dumps({'error': 'Unknown message type'}))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Invalid JSON'}))

    async def handle_chat_message(self, data):
        message = data.get('message')
        
        # Broadcast the message to all connected users
        await self.channel_layer.group_send(
            'chat_group',
            {
                'type': 'chat_message',
                'message': message,
                'user': self.channel_name
            }
        )

    async def chat_message(self, event):
        message = event['message']
        user = event['user']
        
        await self.send(text_data=json.dumps({
            'message': message,
            'user': user
        }))
